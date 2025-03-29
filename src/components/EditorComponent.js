import isHotkey from 'is-hotkey'
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { Editor, Element as SlateElement, Transforms, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, useSlate, withReact } from 'slate-react'
import { Button, Icon, Toolbar, } from './EditorAsseblyComponents'
import { Box } from '@mui/material'
import HandleNewSpeechToTextInput from "../services/SpeechService";
import * as StorageService from "../services/StorageService"
import SaveDataComponent from "./SaveComponent";
import { ConfirmDeleteModal } from './ModalComponent'
import { EDITOR_MIN_CONSTANT } from '../Data/ConstantValues'
import Notification from "./NotificationComponent";

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const EditorComponent = ({ text }) => {
  
  const [value, setValue] = useState(StorageService.GetFromStorage()); 
  const [deleteContentModalOpen, setDeleteContentModalOpen] = useState(false); 
  const [deleteContentNotificationOpen, setDeleteContentNotificationOpen] = useState(false)
  const [saveContentNotificationOpen, setSaveContentNotificationOpen] = useState(false)
  const [copyClipboardNotificationOpen, setCopyClipboardNotificationOpen] = useState(false)
  const [exportNotificationOpen, setExportNotificationOpen] = useState(false)
  const saveRef = useRef();

  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const clearEditor = useCallback(() => {
    setValue(StorageService.SetStorageValueToDefaultAndReturn())
    editor.children = [...EDITOR_MIN_CONSTANT]
    setDeleteContentNotificationOpen(true)
  }, [editor]);

  useEffect(() => {}, [value]);

  useEffect(() => {
    if(text === undefined || text === null || text === "")
      return

    setValue(oldValue => HandleNewSpeechToTextInput(oldValue, text))
  }, [text]);

  function OpenClearModal(){
    setDeleteContentModalOpen(true)
  }

  function SaveEditorContent(){
    saveRef.current.SaveTrigger()
    setSaveContentNotificationOpen(true)
  }

  function CopyEditorContent(){

    setCopyClipboardNotificationOpen(true)
  }

  function ExportEditorContent(){

    setExportNotificationOpen(true)
  }

  function ShowHelpModal(){
  
  }

  return (
    <>
      <Box sx={{ width: "100%", mb: 1}}>
        <Slate editor={editor} value={value} initialValue={value} onChange={setValue}>
          <Toolbar style={{
            borderTop: "2px solid #eee",
            paddingTop: "20px",
            marginLeft: "1px",
            marginRight: "1px"
          }}>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", gap:2, justifyContent: "center"}}>
              <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", border: "3px solid white", borderRadius: 1, padding: 1, gap:2}}>
                <ActionButton action={() => SaveEditorContent() } icon="Save" />
                <ActionButton action={() => OpenClearModal()} icon="Delete" />
                <ActionButton action={() => CopyEditorContent()} icon="ContentCopy" />
                <ActionButton action={() => ExportEditorContent()} icon="Article"/>
              </Box>
              <MarkButton format="bold" icon="FormatBold" />
              <MarkButton format="italic" icon="FormatItalic" />
              <MarkButton format="underline" icon="FormatUnderlined" />
              <BlockButton format="heading-one" icon="LooksOne" />
              <BlockButton format="heading-two" icon="LooksTwo" />
              <BlockButton format="numbered-list" icon="FormatListNumbered" />
              <BlockButton format="bulleted-list" icon="FormatListBulleted" />
              <BlockButton format="left" icon="FormatAlignLeft" />
              <BlockButton format="center" icon="FormatAlignCenter" />
              <BlockButton format="right" icon="FormatAlignRight" />
              <BlockButton format="justify" icon="FormatAlignJustify" />
              <ActionButton action={() => ShowHelpModal() } icon="Help" />
            </Box>
          </Toolbar>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Amint elkezded a diktálást, itt jelenik meg a szöveg... (ezt a mezőt szabadon szerkesztheted is)"
            spellCheck
            autoFocus
            onKeyDown={event => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault()
                  const mark = HOTKEYS[hotkey]
                  toggleMark(editor, mark)
                }
              }
            }}
            style={{
              width: "100%", // Half of the screen width
                height: "55vh", // Full height
                padding: "20px",
                boxSizing: "border-box",
                overflowY: "auto",
                border: "3px solid white",
                borderRadius: "5px"
              }}
              />
        </Slate>
      </Box>
      <SaveDataComponent text={value} ref={saveRef}/>
      <ConfirmDeleteModal opened={deleteContentModalOpen} setOpened={setDeleteContentModalOpen} callback={clearEditor} />
      <Notification opened={deleteContentNotificationOpen} setOpened={setDeleteContentNotificationOpen} notificationSeverity="info" text="A szövegdoboz tartalma törölve lett" />
      <Notification opened={saveContentNotificationOpen} setOpened={setSaveContentNotificationOpen} notificationSeverity="success" text="A szövegdoboz tartalma mentve lett a böngészőben" />
      <Notification opened={copyClipboardNotificationOpen} setOpened={setCopyClipboardNotificationOpen} notificationSeverity="success" text="A szövegdoboz tartalma másolva lett a vágólapra" />
      <Notification opened={exportNotificationOpen} setOpened={setExportNotificationOpen} notificationSeverity="success" text="A szövegdoboz tartalma exportálva lett Word fájlba" />
    </>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? 'align' : 'type'
  )
  const isList = isListType(format)
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      isListType(n.type) &&
      !isAlignType(format),
    split: true,
  })
  let newProperties
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes(editor, newProperties)
  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === 'align' && isAlignElement(n)) {
            return n.align === format
          }
          return n.type === format
        }
        return false
      },
    })
  )
  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  const style = {}
  if (isAlignElement(element)) {
    style.textAlign = element.align
  }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.code) {
    children = <code>{children}</code>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  if (leaf.underline) {
    children = <u>{children}</u>
  }
  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        isAlignType(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon iconName={icon} />
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon iconName={icon} />
    </Button>
  )
}

const ActionButton = ({ action, icon }) => {
  return (
    <Button
      active={false}
      onMouseDown={event => {
        event.preventDefault()
        action()
      }}
    >
      <Icon iconName={icon} />
    </Button>
  )
}

const isAlignType = format => {
  return TEXT_ALIGN_TYPES.includes(format)
}

const isListType = format => {
  return LIST_TYPES.includes(format)
}

const isAlignElement = element => {
  return 'align' in element
}

export default EditorComponent;