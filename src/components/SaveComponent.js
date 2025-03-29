import { Typography } from "@mui/material"
import { useState, useEffect, forwardRef, useImperativeHandle } from "react"
import * as StorageService from "../services/StorageService"

const SaveDataComponent = forwardRef(({ text }, ref) => {

    const [lastSaved, setLastSaved] = useState(" Még nincs mentve")
    const [actualData, setActualData] = useState(text ?? "")

    function Save(){
        StorageService.SaveToStorage(actualData)
        setLastSaved(" " + (new Date()).toLocaleString())
    }

    useEffect(() => {
        const interval = setInterval(Save, 30000) //save every half minute

        return () => {
            clearInterval(interval)
        }
    })

    useEffect(() => {
        setActualData(text)
    }, [text])

    useImperativeHandle(ref, () => ({
        SaveTrigger() {
          Save()
        },
    }));

    return (
        <Typography sx={{color: "gray", fontStyle: "italic"}}>Utóljára mentve:{lastSaved}</Typography>
    )
});

export default SaveDataComponent;