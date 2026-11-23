import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:3000/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Login response:", res.data);

      if (!res.data.token || !res.data.userId) {
        alert("Login response is missing token or user ID.");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);

      alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      if (err.response) {
        console.log("Backend response:", err.response.data);

        alert(
          err.response.data?.message ||
          err.response.data?.error ||
          "Login Failed!"
        );
      } else {
        alert("Cannot connect to backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <h1>Sign In</h1>
        </div>

        <form className="login-box" onSubmit={handleLogin}>
          <div>
            <label className="label">Email address</label>

            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="div">
            <label className="label">Password</label>

            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>

        <div className="pass-box">
          <p>
            New to GitHub? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
