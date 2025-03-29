import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Notification = ({ opened, setOpened, notificationSeverity, text }) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(opened)
  },[opened])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    setOpened(false);
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical:'bottom',horizontal: 'right'}}>
        <Alert
          onClose={handleClose}
          severity={notificationSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {text}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Notification;