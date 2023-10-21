import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ChangePasswordPage.module.css";
import { useUserContext } from "../UserContext";

import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useAppDispatch } from "../store/hook";
import { enqueueSuccessSnackbarMessage } from "../store/slices/successSnackbarSlice";

// Should only allow change of password if old password matches!
const ChangePasswordPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser, setCurrentUser } = useUserContext();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const isAuthenticated =
    currentUser && Object.keys(currentUser).length != 0 && currentUser.username;

  // check if currentUser is authenticated, if not, direct back to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <></>;
  }

  const handleChangePassword = async () => {
    setIsSubmitting(true);

    if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
      setError("Please fill in credentials, and ensure new passwords match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.put(`/api/users/${currentUser?.username}`, {
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        dispatch(
          enqueueSuccessSnackbarMessage("Password changed successfully")
        );

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // no update of localStorage, do not store password locally
        navigate("/profile");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Change password failed:", error);
        setError("User credential is incorrect");
      } else {
        setError("Changing password failed. Try again later.");
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewPassword("");
    setConfirmPassword("");
    navigate("/profile");
  };

  return (
    <div>
      <div className={styles.login_container}>
        <h1>Change Password</h1>
        <div className={styles.input_field}>
          <label className={styles.the_label} htmlFor="oldPassword">
            Old Password
          </label>
          <input
            className={styles.input_text}
            id="oldPassword"
            type="password"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setError(null);
            }}
          />
        </div>
        <div className={styles.input_field}>
          <label className={styles.the_label} htmlFor="newPassword">
            New Password
          </label>
          <input
            className={styles.input_text}
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError(null);
            }}
          />
        </div>
        <div className={styles.input_field}>
          <label className={styles.the_label} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className={styles.input_text}
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(null);
            }}
          />
        </div>

        {/* Handle error situation */}
        {error && (
          <Box mb={2}>
            <Alert severity="error" onClose={() => setError(null)}>
              <AlertTitle>Change Password Error</AlertTitle>
              {error}
            </Alert>
          </Box>
        )}

        {/* Provide feedback when success */}
        {success && (
          <Box mb={2}>
            <Alert severity="success">
              <AlertTitle>Change Password Success</AlertTitle>
              {success}
            </Alert>
          </Box>
        )}

        <button
          className={styles.action_button}
          onClick={handleChangePassword}
          disabled={isSubmitting}
        >
          Save
        </button>
        <button className={styles.action_button} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
