import React, { FC, ReactNode } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

import CustomTextField from "../forms/theme-elements/CustomTextField";

interface AuthLoginProps {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
  onUsernameChange: (username: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  username: string;
  password: string;
  error: string | null;
  onErrorChange: (error: string | null) => void;
  success: string | null;
}

const AuthLogin: FC<AuthLoginProps> = ({
  title,
  subtitle,
  subtext,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  username,
  password,
  error,
  onErrorChange,
  success,
}) => (
  <>
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Stack>
      <Box>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="username"
          mb="5px"
        >
          Username
        </Typography>
        <CustomTextField
          id="username"
          type="text"
          fullWidth
          value={username}
          onChange={(e) => {
            onUsernameChange(e.target.value);
            onErrorChange(null); // clear the error when user types
          }}
        />
      </Box>
      <Box mt="25px">
        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
        >
          Password
        </Typography>
        <CustomTextField
          id="password"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => {
            onPasswordChange(e.target.value);
            onErrorChange(null); // clear the error when user types
          }}
        />
      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
        {/* Removed the part of Remember this device FormGroup */}
      </Stack>

      {/* Handle error situation */}
      {error && (
        <Box mb={2}>
          <Alert severity="error" onClose={() => onErrorChange(null)}>
            <AlertTitle>Sign-in Error</AlertTitle>
            {error}
          </Alert>
        </Box>
      )}

      {/* Provide feedback when success */}
      {success && (
        <Box mb={2}>
          <Alert severity="success">
            <AlertTitle>Sign-in Success</AlertTitle>
            {success}
          </Alert>
        </Box>
      )}
    </Stack>
    <Box>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        onClick={onSubmit}
        type="button"
      >
        Sign In
      </Button>
    </Box>
    {subtitle}
  </>
);

export default AuthLogin;
