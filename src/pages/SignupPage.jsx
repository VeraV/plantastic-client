import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CarrotLogo from "../assets/logo.png";
import { API_URL } from "../config/api.config";

export const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  async function handleSignup(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !email || !password || !secondPassword) {
      setErrorMessage("All fields are required!");
      return;
    }

    if (password !== secondPassword) {
      setErrorMessage("Passwords are not matching!");
      return;
    }

    const requestBody = { email, password, name };
    try {
      await axios.post(`${API_URL}/auth/signup`, requestBody);
      navigate("/login");
    } catch (error) {
      const errorDescription = error.response.data.errorMessage;
      setErrorMessage(errorDescription);
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div
        className="card shadow-card p-4 p-md-5"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src={CarrotLogo}
            alt="Plantastic logo"
            width={48}
            height={48}
            className="mb-2"
          />
          <h2 className="fw-bold text-primary">Plantastic</h2>
        </div>

        {/* Login form */}
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="You name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password-repeat" className="form-label fw-semibold">
              Repeat Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="password-repeat"
              placeholder="********"
              value={secondPassword}
              onChange={(e) => setSecondPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Sign Up!
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-3">
          <p className="mb-1">Already have account?</p>
          <p>
            <Link to="/login">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
