import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

const FileExportToWord = (fileContent, fileName) => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: fileContent.map((node) =>
          new Paragraph({
            alignment: node.alignment,
            children: node.children.map((textNode) => 
              new TextRun({ 
                text: textNode.text,
                bold: textNode.bold || false,
                italics: textNode.italics || false,
                underline: textNode.underline || false
              })
            ),
          })
        ),
      },
    ],
  });

  if(fileName === undefined || fileName === null || fileName.trim() === "")
    fileName = "diktalt-dokumentum";

  fileName = fileName.trim()

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${fileName}.docx`);
  });
};

export default FileExportToWord;