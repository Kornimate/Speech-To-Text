import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Stack } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Close, Delete } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'red',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ErrorModal = ({ opened, setOpened }) => {
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpened({
            state: false,
            text: ""
        });
        setOpen(false);
    }

    React.useEffect(() => {
        setOpen(opened.state)
    },[opened])
  
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Hiba
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {opened.text}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Hogy folytassa a diktálást kattintson a kijelző bármely pontjára és amennyiben ebben az üzenetben volt utasítás, azt hajtsa végre
            </Typography>
          </Box>
        </Modal>
      </div>
    );
}

const style2 = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#282c34',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: "white"
};

const ConfirmDeleteModal = ({ opened, setOpened, callback }) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
      setOpened(false);
      setOpen(false);
  }

  function handleDelete(){
    callback()
    handleClose()
  }

  React.useEffect(() => {
      setOpen(opened)
  },[opened])

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Szövegdoboz tartalmának törlése
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Biztosan tötölni akarja a teljes tartalmát a szövegdoboznak?
          </Typography>
          <Stack direction="row" spacing={4} sx={{mt: 2, display:"flex", justifyContent:"end"}}>
            <Button endIcon={<Close />} onClick={handleClose} variant='outlined' color='secondary'>Mégse</Button>
            <Button endIcon={<Delete />} onClick={handleDelete} variant='outlined' color='error'>Törlés</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

const GetFileNameModal = ({ opened, setOpened, callback }) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
      setOpened(false);
      setOpen(false);
  }

  function handleDelete(){
    callback()
    handleClose()
  }

  React.useEffect(() => {
      setOpen(opened)
  },[opened])

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style2}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Szövegdoboz tartalmának törlése
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Biztosan tötölni akarja a teljes tartalmát a szövegdoboznak?
          </Typography>
          <Stack direction="row" spacing={4} sx={{mt: 2, display:"flex", justifyContent:"end"}}>
            <Button endIcon={<Close />} onClick={handleClose} variant='outlined' color='secondary'>Mégse</Button>
            <Button endIcon={<Delete />} onClick={handleDelete} variant='outlined' color='error'>Törlés</Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}

export { ErrorModal, ConfirmDeleteModal, GetFileNameModal };