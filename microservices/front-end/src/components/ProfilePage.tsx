import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { User } from "./types";
import styles from "./ProfilePage.module.css";
import { useUserContext } from "../UserContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const ProfilePage: React.FC = () => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUserContext();

  // check if currentUser is authenticated, if not, direct back to login
  useEffect(() => {
    if (Object.keys(currentUser).length != 0 && !currentUser.username) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleCloseDialog = () => {
    setError(null); // Clear any previous errors
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setError(null);
    setOpenDialog(true); // open the dialog when delete button is confirmed
  };

  const handleDelete = () => {
    if (
      !currentUser ||
      Object.keys(currentUser).length === 0 ||
      !currentUser.username
    ) {
      setError("User data not available");
      console.error("User data not available");
      return;
    }

    axios
      // Should use `` instead of ""! "" will take ${user.username} literally, while `` will parse it
      .delete(`/api/users/${currentUser.username}`)
      .then((response) => {
        if (response.status === 200) {
          setCurrentUser({} as User);
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error deleting account", error);
        if (axios.isAxiosError(error) && error.response) {
          setError(`Failed to delete account: ${error.response.data}`);
        } else {
          setError("Failed to delete account due to an unknown error");
        }
      })
      .finally(() => {
        // Close the dialog in any case
        setOpenDialog(false);
      });
  };

  return (
    <div>
      <div className={styles.header_container}>
        <h1>Personal Profile</h1>
      </div>
      <div className={styles.profile_container}>
        <div className={styles.profile_detail}>
          <span className={styles.label_name}>Username: </span>
          <span className={styles.user_info}> {currentUser?.username} </span>
        </div>
        <div className={styles.profile_detail}>
          <span className={styles.label_name}>Display Name: </span>
          <span className={styles.user_info}>{currentUser?.displayName}</span>
        </div>
        <div className={styles.profile_detail}>
          <span className={styles.label_name}>Role: </span>
          <span className={styles.user_info}>{currentUser?.role}</span>
        </div>
        <button
          className={styles.action_button}
          onClick={() => navigate("/change-password")}
        >
          Change Password
        </button>
        <button
          className={styles.action_button}
          onClick={() => navigate("/change-display-name")}
        >
          Change Display Name
        </button>
        <button className={styles.action_button} onClick={handleOpenDialog}>
          Delete Account
        </button>

        {/* Handle error situation */}
        {error && (
          <Box mb={2}>
            <Alert severity="error" onClose={() => setError(null)}>
              <AlertTitle>Delete Account Error</AlertTitle>
              {error}
            </Alert>
          </Box>
        )}
      </div>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete your account? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default ProfilePage;
