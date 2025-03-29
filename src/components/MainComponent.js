import { Box, Button, Stack, Typography } from "@mui/material";
import { useState, useRef } from "react";
import "../styles/MainComponent.css"
import EditorComponent from "./EditorComponent"
import { ErrorModal } from "./ModalComponent";
import { PlayCircleOutlined, StopCircleOutlined, RadioButtonCheckedOutlined, RadioButtonUncheckedOutlined } from '@mui/icons-material'
import Notification from "./NotificationComponent";
import * as StorageService from "../services/StorageService"

const MainComponent = () => {
    
    const [text, setText] = useState(StorageService.GetFromStorage());

    const [modalOpen, setModalOpen] = useState({
        state: false,
        text: ""
    })

    const [notificationOpen, setNotificationOpen] = useState(false)
    
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    const startRecognition = () => {
        if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
            showErrorModal("A böngészője nem támogatja a beszédfelismerést! :(");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = "hu-HU";
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            setText(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
            setNotificationOpen(true)
        };

        recognition.onerror = (event) => {
            showErrorModal("A rögzítésben váratlan hiba lépett fel, másolja amit lehet (folyamatmentés céljából, később visszaillesztheti a szövegmezőbe) és folytassa onnan ahonnan tudja")
            console.error("Error:", event.error);
            setIsListening(false);
            setNotificationOpen(true)
        };

        recognition.onnomatch = (event) => showErrorModal("Az elhangzott bemenetet a gép nem ismerte fel :(");

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            setNotificationOpen(true)
        }
    };

    function showErrorModal(errorMessage){
        setModalOpen({
            state: true,
            text: errorMessage
        })
    }
    
    return (
        <>
            <Box sx={{marginBottom:"1rem", width:"90%"}}>
                <Stack className={isListening ? "statusTextRecording" : "statusTextNotRecording"} direction="row" spacing={2} sx={{justifyContent: "center", mb: 2}}>
                    <Typography>
                        {isListening ? "Az Applikáció rögzít" : "Az Applikáció nem rögzít"}
                    </Typography>
                    {isListening ? <RadioButtonCheckedOutlined /> : <RadioButtonUncheckedOutlined /> }
                </Stack>
                <Button variant="outlined" color="success" onClick={startRecognition} disabled={isListening} sx={{ width:"49%", minWidth:"250px", marginRight:"2%"}} endIcon={ <PlayCircleOutlined /> }>Rögzítés Elkezdése</Button>
                <Button variant="outlined" color="error" onClick={stopRecognition} disabled={!isListening} sx={{ width:"49%", minWidth:"250px"}} endIcon={<StopCircleOutlined /> }>Rögzítés Vége</Button>
            </Box>
            <Box sx={{width:"90%", display: "flex", flexDirection:"column", justifyContent: "center", alignItems: "center"}}>
                <EditorComponent text={text} />
            </Box>
            <ErrorModal opened={modalOpen} setOpened={setModalOpen} />
            <Notification opened={notificationOpen} setOpened={setNotificationOpen} notificationSeverity="warning" text="A rögzítés leállt" />
        </>
    )
}

export default MainComponent;