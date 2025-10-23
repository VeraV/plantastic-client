import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Navbar = () => {
  const { isLoggedIn, currentUser, handleLogout } = useContext(AuthContext);

  return (
    <nav>
      <Link to="/">
        <button>Home</button>
      </Link>
      {!isLoggedIn && (
        <>
          <Link to="/signup">
            <button>Sign Up!</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      )}
      {isLoggedIn && (
        <>
          <Link to="/profile">
            <button>Go To Profile</button>
          </Link>
          <span>{currentUser && currentUser.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};
