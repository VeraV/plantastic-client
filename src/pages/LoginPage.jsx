import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const API_URL = "http://localhost:5005";
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
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit">Let me in!</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Don't have an account?</p>
      <Link to={"/signup"}>Sign Here</Link>
    </div>
  );
};
