import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const API_URL = "http://localhost:5005";
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
    <div>
      <form onSubmit={handleSignup}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </label>
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
        <label>
          Repeat Password:
          <input
            type="password"
            value={secondPassword}
            onChange={(e) => setSecondPassword(e.target.value)}
          />
        </label>
        <button type="submit">Sign Up!</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Already have account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  );
};
