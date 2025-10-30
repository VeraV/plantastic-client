import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CarrotLogo from "../assets/logo.png";
import { API_URL } from "../config/api.config";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("All fields are required!");
      return;
    }

    const requestBody = { email, password };
    try {
      const response = await axios.post(`${API_URL}/auth/login`, requestBody);
      storeToken(response.data.authToken);
      await authenticateUser();
      navigate("/profile");
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
        <form onSubmit={handleLogin}>
          <div className="mb-3">
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
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Let me in!
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-3">
          <p className="mb-1">Don't have an account?</p>
          <p>
            <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
