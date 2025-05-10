import React, { useState } from "react";
import axios from "axios";
import ShootingStars from "./ShootingStars";
import "./RegisterScreen.css";

const RegisterScreen = () => {
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = e.target.elements;
    try {
      await axios.post("http://localhost:5000/register", {
        name: name.value,
        email: email.value,
        password: password.value,
      });
      setMessage("Registration successful! Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMessage("Registration failed. Email may already be in use.");
    }
  };

  return (
    <div className="register-screen">
      <ShootingStars />
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterScreen;
