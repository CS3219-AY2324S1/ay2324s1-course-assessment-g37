import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import { User } from "./types";
// components
import PageContainer from "./container/PageContainer";
import AuthLogin from "./auth/AuthLogin";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { currentUser, setCurrentUser } = useUserContext();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "/api/auth/log-in",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const userData: User = response.data;
        setCurrentUser(userData);
        console.log("Current user set");
        console.log(currentUser.username);
        // navigate("/question-bank");

        setSuccess("Successfully logged in!");
      }
    } catch (error: unknown) {
      setSuccess(null);

      if (axios.isAxiosError(error)) {
        setError("Incorrect user credentials!");
      } else {
        setError("An unknown error occurred. Try again later.");
        console.error("An unknown error occured: ", error);
      }
    }
  };

  return (
    <PageContainer title="Login" description="this is Login page">
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
            <AuthLogin
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
                  spacing={1}
                  justifyContent="center"
                  mt={3}
                  alignItems="center"
                >
                  <Typography
                    color="textSecondary"
                    fontWeight="500"
                    fontSize="1.25rem"
                  >
                    New to PeerPrep?
                  </Typography>
                  <Typography
                    component={Link}
                    to="/signup"
                    fontWeight="500"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                    }}
                  >
                    Create an account
                  </Typography>
                </Stack>
              }
              onUsernameChange={(username) => setUsername(username)}
              onPasswordChange={(password) => setPassword(password)}
              onSubmit={handleLogin}
              username={username}
              password={password}
              error={error}
              onErrorChange={setError}
              success={success}
            />
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
export default Login;
