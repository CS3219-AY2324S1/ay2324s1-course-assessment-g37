import React, { FC, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import CustomTextField from "../forms/theme-elements/CustomTextField";
import { Stack } from "@mui/system";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

interface AuthRegisterProps {
  title?: string;
  subtitle?: ReactNode;
  subtext?: ReactNode;
  onUsernameChange: (username: string) => void;
  onDisplayNameChange: (displayName: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onSignup: () => void;
  username: string;
  displayName: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  onErrorChange: (error: string | null) => void;
  success: string | null;
  isSubmitting: boolean;
}

const AuthRegister: FC<AuthRegisterProps> = ({
  title,
  subtitle,
  subtext,
  onUsernameChange,
  onDisplayNameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSignup,
  username,
  displayName,
  password,
  confirmPassword,
  error,
  onErrorChange,
  success,
  isSubmitting,
}) => (
  <Box display="flex" flexDirection="column">
    {title ? (
      <Typography fontWeight="700" variant="h2" mb={1}>
        {title}
      </Typography>
    ) : null}

    {subtext}

    <Box>
      <Stack mb={3}>
        {/* mb=3 just control margin-bottom of Stack component! */}
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
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => {
            onUsernameChange(e.target.value);
            onErrorChange(null);
          }}
        />

        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="displayName"
          mb="5px"
          mt="20px"
        >
          Display Name
        </Typography>
        <CustomTextField
          id="displayName"
          variant="outlined"
          fullWidth
          value={displayName}
          onChange={(e) => {
            onDisplayNameChange(e.target.value);
            onErrorChange(null);
          }}
        />

        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="password"
          mb="5px"
          mt="20px"
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
            onErrorChange(null);
          }}
        />

        <Typography
          variant="subtitle1"
          fontWeight={600}
          component="label"
          htmlFor="confirmPassword"
          mb="5px"
          mt="20px"
        >
          Confirm Password
        </Typography>
        <CustomTextField
          id="confirmPassword"
          type="password"
          variant="outlined"
          fullWidth
          value={confirmPassword}
          onChange={(e) => {
            onConfirmPasswordChange(e.target.value);
            onErrorChange(null);
          }}
        />

        {/* Handle error situation */}
        {error && (
          <Box mt={2}>
            <Alert severity="error" onClose={() => onErrorChange(null)}>
              <AlertTitle>Registeration Error</AlertTitle>
              {error}
            </Alert>
          </Box>
        )}

        {/* Provide feedback when success */}
        {success && (
          <Box mt={2}>
            <Alert severity="success">
              <AlertTitle>Sign-up Success</AlertTitle>
              {success}
            </Alert>
          </Box>
        )}
      </Stack>
      <Button
        color="primary"
        variant="contained"
        size="large"
        fullWidth
        onClick={onSignup}
        type="button"
        disabled={isSubmitting} // Disable the button during submission
      >
        Sign Up
      </Button>
    </Box>
    {subtitle}
  </Box>
);

export default AuthRegister;
