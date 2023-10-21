// Use a separate component in nested routing to save repetitive codes
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  IconButton,
  ListItemText,
  Box,
  ListItemButton,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";
import { User } from "./types";

import { Outlet } from "react-router-dom"; // allow render nested routes

const TopBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { currentUser, setCurrentUser } = useUserContext();
  const navigate = useNavigate();

  const isAuthenticated =
    currentUser && Object.keys(currentUser).length != 0 && currentUser.username;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <></>;
  }

  const handleHistory = () => {
    navigate("/history");
  };

  const handleFindMatch = () => {
    navigate("/find-match");
  };

  const handleQuestion = () => {
    navigate("/question-bank");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleSignout = () => {
    axios
      .delete("/api/auth/log-out")
      .then((response) => {
        if (response.status === 200) {
          // reset user context
          setCurrentUser({} as User);
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error during sign out:", error);
        alert("Failed to sign out, please try again!");
      });
  };

  const list = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleFindMatch();
              setIsOpen(false);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.14)",
              },
            }}
          >
            <ListItemText primary="Find Match" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleQuestion();
              setIsOpen(false);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.14)",
              },
            }}
          >
            <ListItemText primary="Question" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleHistory();
              setIsOpen(false);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.14)",
              },
            }}
          >
            <ListItemText primary="History" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              handleProfile();
              setIsOpen(false);
            }}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.14)",
              },
            }}
          >
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsOpen(true)}
            sx={{ mr: 2 }} // add some margin to space HOME
          >
            <MenuIcon />
          </IconButton>
          <Typography fontSize="1.5rem" style={{ flexGrow: 1 }}>
            HOME
          </Typography>
          <Button color="inherit" onClick={handleSignout}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isOpen} onClose={() => setIsOpen(false)}>
        {list}
      </Drawer>
      <Outlet /> {/* This will render the nested route */}
    </>
  );
};

export default TopBar;
