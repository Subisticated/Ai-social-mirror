import React, { useState } from "react";
import axios from "axios";
import ShootingStars from "./ShootingStars";
import "./LoginScreen.css";

const LoginScreen = () => {
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: email.value,
        password: password.value,
      });
      localStorage.setItem("token", response.data.token);
      setMessage("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      setMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-screen">
      <ShootingStars />
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Not registered? <a href="/register">Create an account</a>
      </p>
    </div>
  );
};

export default LoginScreen;
