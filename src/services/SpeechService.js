function HandleNewSpeechToTextInput(originalText, newInput){
    

    return [...originalText, {
        type: 'paragraph',
        children: [
          { text: newInput },
        ],
      },]
}

export default HandleNewSpeechToTextInput;