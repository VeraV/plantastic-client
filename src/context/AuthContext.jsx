import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const API_URL = "http://localhost:5005";

const AuthContentWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const nav = useNavigate();

  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  async function authenticateUser() {
    const theToken = localStorage.getItem("authToken");

    if (theToken) {
      try {
        const { data } = await axios.get(`${API_URL}/auth/verify`, {
          headers: { authorization: `Bearer ${theToken}` },
        });
        setCurrentUser(data);
        setIsLoading(false);
        setIsLoggedIn(true);
      } catch (error) {
        console.log(error);
        setCurrentUser({});
        setIsLoading(false);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoading(false);
      setCurrentUser({});
      setIsLoggedIn(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    nav("/login");

    setCurrentUser({});
    setIsLoading(false);
    setIsLoggedIn(false);
  }

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isLoggedIn,
        authenticateUser,
        handleLogout,
        storeToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContentWrapper };
