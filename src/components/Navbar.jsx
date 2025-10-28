import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CarrotLogo from "../assets/logo.png";
import HomeIcon from "../assets/house-door.svg";

export const Navbar = () => {
  const { isLoggedIn, currentUser, handleLogout } = useContext(AuthContext);

  return (
    <header className="bg-white shadow-sm">
      <div className="container py-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <Link to="/">
            <img
              src={CarrotLogo}
              alt="Plantastic logo"
              width={36}
              height={36}
            />
          </Link>
          <Link
            to="/"
            className="text-decoration-none fw-bold text-primary h5 m-0"
          >
            Plantastic
          </Link>
        </div>
        <Link to="/recipes">
          <button className="btn btn-outline-success me-2">Recipes</button>
        </Link>
        {isLoggedIn && (
          <Link to="/recipes/new">
            <button className="btn btn-outline-success me-2">
              + New Recipe
            </button>
          </Link>
        )}
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          {isLoggedIn ? (
            <>
              <span>{currentUser && `Hello, ${currentUser.name}`}</span>
              <button onClick={handleLogout} className="btn btn-outline-danger">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </>
          ) : (
            <Link to={isLoggedIn ? "/profile" : "/login"}>
              <button className="btn btn-primary">Get Started</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
