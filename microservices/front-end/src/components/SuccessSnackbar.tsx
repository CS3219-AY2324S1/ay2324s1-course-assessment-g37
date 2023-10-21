import { Alert, Snackbar } from "@mui/material";
import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  closeSuccessSnackbar,
  popAndShowNextSuccessSnackbarMessage,
  resetCurrentSuccessSnackbarMessage,
} from "../store/slices/successSnackbarSlice";

function SuccessSnackbar(): JSX.Element {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.successSnackbar.isOpen);
  const currentMessage = useAppSelector(
    (state) => state.successSnackbar.currentMessage
  );
  const messageQueue = useAppSelector(
    (state) => state.successSnackbar.messageQueue
  );

  // referenced from https://mui.com/material-ui/react-snackbar/#consecutive-snackbars
  useEffect(() => {
    if (messageQueue.length > 0 && currentMessage === "" && !open) {
      // Set a new snack when we don't have an active one
      dispatch(popAndShowNextSuccessSnackbarMessage());
    } else if (messageQueue.length > 0 && currentMessage !== "" && open) {
      // Close an active snack when a new one is added
      dispatch(closeSuccessSnackbar());
    }
  }, [dispatch, currentMessage, messageQueue.length, open]);

  const handleClose = useCallback(
    (event: React.SyntheticEvent | Event, reason?: string) => {
      // if user clicks away from the snack bar, do not close the snack bar
      if (reason === "clickaway") {
        return;
      }
      dispatch(closeSuccessSnackbar());
    },
    [dispatch]
  );

  const handleExited = useCallback(() => {
    dispatch(resetCurrentSuccessSnackbarMessage());
  }, [dispatch]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      TransitionProps={{ onExited: handleExited }}
    >
      <Alert
        onClose={handleClose}
        variant="filled"
        severity="success"
        sx={{ width: "100%" }}
      >
        {currentMessage}
      </Alert>
    </Snackbar>
  );
}

export default SuccessSnackbar;
