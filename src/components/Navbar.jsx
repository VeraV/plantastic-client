import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CarrotLogo from "../assets/logo.png";

export const Navbar = () => {
  const { isLoggedIn, currentUser, handleLogout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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

        <div className="justify-content-between" id="navbarNav">
          {/* Centered nav links */}
          <div className="d-flex justify-content-center flex-grow-1">
            <div className="d-flex gap-3">
              <Link
                to="/recipes"
                className={`btn btn-nav ${
                  isActive("/recipes") ? "active" : ""
                }`}
              >
                All Recipes
              </Link>

              {isLoggedIn && (
                <Link
                  to="/recipes/new"
                  className={`btn btn-nav ${
                    isActive("/recipes/new") ? "active" : ""
                  }`}
                >
                  + Add Recipe
                </Link>
              )}

              <Link
                to="/about"
                className={`btn btn-nav ${isActive("/about") ? "active" : ""}`}
              >
                About
              </Link>
            </div>
          </div>
        </div>

        {/* Auth section */}
        <div className="d-flex align-items-center gap-3">
          {isLoggedIn ? (
            <div className="d-flex align-items-center gap-2">
              <span className="fw-semibold text-secondary">
                {currentUser && `Hello, ${currentUser.name}`}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-nav"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          ) : (
            <Link
              to={isLoggedIn ? "/profile" : "/login"}
              className="btn btn-orange fw-semibold px-4"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
