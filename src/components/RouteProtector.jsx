import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const RouteProtector = ({ children }) => {
  const { isLoading, isLoggedIn } = useContext(AuthContext);
  console.log("In RouteProtector: " + isLoading + isLoggedIn);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <div>{children}</div>;
};
