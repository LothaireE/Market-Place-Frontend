import { Snackbar } from '@mui/material';
import type { SnackbarCloseReason } from '@mui/material';
import { useState, useEffect } from 'react';


const Toast = ({
    onOpen,
    onClose,
    message,
    severity
}: {
    onOpen: boolean;
    onClose: () => void;
    message: string;
    severity: 'success' | 'info' | 'warning' | 'error';
}) => {
    const [openToast, setOpenToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');
    
    useEffect(() => {
        setOpenToast(onOpen);
        if (message) setToastMessage(message);
        if (severity) setToastSeverity(severity);

        setTimeout(() => {
            setOpenToast(false);
            setToastMessage('');
        }, 4000);

    }, [onOpen, message, severity]);

    

  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastMessage('');
    setOpenToast(false);
    onClose();
  };

    return (
        <>
        {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar
        open={openToast}
        autoHideDuration={4000}
        onClose={handleClose}
        message={toastMessage}
        security={toastSeverity}
      />
        </>
    );
};

export default Toast;