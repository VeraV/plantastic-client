import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api.config";

const AuthContext = createContext();

const AuthContentWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [totalShoppingList, setTotalShoppingList] = useState(null);
  const [shopListIsChanged, setShopListIsChanged] = useState(false);
  const [totalShoppingListId, setTotalShoppingListId] = useState(null);
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
        const res = await axios.get(
          `${API_URL}/api/shopping-list/user/${data._id}`,
          { headers: { Authorization: `Bearer ${theToken}` } }
        );
        setTotalShoppingList(res.data.items);
        setTotalShoppingListId(res.data._id);

        setIsLoading(false);
        setIsLoggedIn(true);
      } catch (error) {
        console.log(error);
        setCurrentUser(null);
        setIsLoading(false);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoading(false);
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("authToken");
    console.log("in logout");
    nav("/");

    setCurrentUser(null);
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
        totalShoppingList,
        setTotalShoppingList,
        shopListIsChanged,
        setShopListIsChanged,
        totalShoppingListId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContentWrapper };
