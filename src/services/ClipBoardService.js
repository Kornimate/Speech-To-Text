export function CopyToClipBoard(data){
    const text = data.map(x => x.children.map(y=> y.text).join(" ")).join("\n")
    navigator.clipboard.writeText(text)
}