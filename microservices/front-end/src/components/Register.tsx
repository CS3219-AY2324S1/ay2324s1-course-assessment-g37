import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Card, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";

import PageContainer from "./container/PageContainer";
// import Logo from '../layouts/full/shared/logo/Logo';
import AuthRegister from "./auth/AuthRegister";
import { useUserContext } from "../UserContext";
import { useAppDispatch } from "../store/hook";
import { enqueueSuccessSnackbarMessage } from "../store/slices/successSnackbarSlice";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<"basic" | "admin">("basic");
  const { currentUser, setCurrentUser } = useUserContext();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const isAuthenticated =
    currentUser && Object.keys(currentUser).length != 0 && currentUser.username;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/question-bank");
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return <></>;
  }

  const handleSignup = async () => {
    setIsSubmitting(true);

    const alphanumeric = /^[a-z0-9]+$/i; // only allow alphanumeric for username, displayName

    if (!username || !displayName || !password) {
      setError("Required fields not filled up");
      setIsSubmitting(false);
      return;
    }

    if (!alphanumeric.test(username) || !alphanumeric.test(displayName)) {
      setError("Username and Display Name must be alphanumeric.");
      setIsSubmitting(false);
      return;
    }

    if (password != confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await axios.post("/api/auth/sign-up", {
        username,
        displayName,
        password,
        role,
      });

      if (response.status == 200) {
        dispatch(
          enqueueSuccessSnackbarMessage("Account successfully created!")
        );

        navigate("/login");
      }
    } catch (error: unknown) {
      setSuccess(null);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          // Status code for repetitive account
          setError("Username is already being used. Please use another one.");
        } else {
          console.error("Signup failed:", error);
          setError(error.response?.data.message || "Failed to create account");
        }
      } else {
        setError("An unknown error occurred. Try again later.");
        console.error("An unknown error occurred:", error);
      }
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <PageContainer title="Register" description="this is Register page">
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#F1F3FE",
          overflowY: "scroll",
          display: "flex",
        }}
      >
        <div style={{ margin: "auto" }}>
          <Card
            elevation={9}
            sx={{
              margin: "3rem 0",
              p: 4,
              zIndex: 1,
              width: "500px",
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center">
              {/* <Logo /> */}
            </Box>
            <AuthRegister
              subtext={
                <Typography
                  variant="subtitle1"
                  textAlign="center"
                  color="textSecondary"
                  mb={1}
                  fontSize="1.25rem"
                >
                  Your Technical Interview Prep Platform
                </Typography>
              }
              subtitle={
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1}
                  mt={3}
                  alignItems="center" // align them vertically
                >
                  <Typography
                    color="textSecondary"
                    // variant="h6"
                    fontWeight="500" // for how bold the text is
                    fontSize="1.25rem" // for how large the text is
                  >
                    Already have an Account?
                  </Typography>
                  <Typography
                    component={Link}
                    to="/login"
                    fontWeight="500"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                  >
                    Sign In
                  </Typography>
                </Stack>
              }
              onUsernameChange={(username) => setUsername(username)}
              onDisplayNameChange={(displayName) => setDisplayName(displayName)}
              onPasswordChange={(password) => setPassword(password)}
              onConfirmPasswordChange={(confirmPassword) =>
                setConfirmPassword(confirmPassword)
              }
              onSignup={handleSignup}
              username={username}
              displayName={displayName}
              password={password}
              confirmPassword={confirmPassword}
              error={error}
              onErrorChange={setError}
              success={success}
              isSubmitting={isSubmitting}
            />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default Register;
