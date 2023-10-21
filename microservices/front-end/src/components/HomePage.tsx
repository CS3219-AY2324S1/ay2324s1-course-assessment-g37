import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../UserContext";

function HomePage(): JSX.Element {
  const { currentUser, setCurrentUser } = useUserContext();
  const navigate = useNavigate();

  const isAuthenticated =
    currentUser && Object.keys(currentUser).length != 0 && currentUser.username;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/question-bank");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return <></>;
}

export default HomePage;
