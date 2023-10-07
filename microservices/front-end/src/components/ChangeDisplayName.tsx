import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ChangeDisplayName.module.css";
import { useUserContext } from "../UserContext";

import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

// Similarly, should only allow change of display name if passes authentication
const ChangeDisplayName: React.FC = () => {
  const { currentUser, setCurrentUser } = useUserContext();
  const [displayName, setDisplayName] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleChangeDisplayName = async () => {
    const alphanumeric = /^[a-z0-9]+$/i;
    if (!displayName) {
      setError("New display name cannot be empty");
      return;
    }

    if (!alphanumeric.test(displayName)) {
      setError("Display Name must be alphanumeric.");
      return;
    }

    try {
      const updatedUser = {
        ...currentUser,
        displayName,
      };
      const response = await axios.put(
        `/api/users/${updatedUser.username}`,
        updatedUser
      );
      if (response.status === 200) {
        setCurrentUser(updatedUser);
        setSuccess("Display name changed successfully");
        setDisplayName("");

        setTimeout(() => {
          navigate("/profile");
        }, 500);
      }
    } catch (error: unknown) {
      // display name can just allow update
      setSuccess(null);
      setError("Changing of display name failed");
      console.error("An unknown error occurred:", error);
    }
  };

  const handleCancel = () => {
    setDisplayName("");
    navigate("/profile");
  };

  return (
    <div>
      <div className={styles.change_display_name_container}>
        <h1>Change Display Name</h1>
        <div className={styles.input_field}>
          <label className={styles.the_label} htmlFor="displayName">
            New Display Name
          </label>
          <input
            className={styles.input_text}
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              setError(null);
            }}
          />
        </div>

        {/* Handle error situation */}
        {error && (
          <Box mb={2}>
            <Alert severity="error" onClose={() => setError(null)}>
              <AlertTitle>Change Display Name Error</AlertTitle>
              {error}
            </Alert>
          </Box>
        )}

        {/* Provide feedback when success */}
        {success && (
          <Box mb={2}>
            <Alert severity="success">
              <AlertTitle>Change Display Name Success</AlertTitle>
              {success}
            </Alert>
          </Box>
        )}

        <button
          className={styles.action_button}
          onClick={handleChangeDisplayName}
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
export default ChangeDisplayName;
