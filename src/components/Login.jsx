import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // prevent multiple login
  if (user) {
    alert("Already logged in! Please logout first.");
    navigate("/");
    return;
  }

  const nameRegex = /^[A-Za-z\s]+$/; // ✅ only letters + spaces

  // empty check
  if (!form.name || !form.password) {
    alert("Please fill all fields");
    return;
  }

  // ❌ reject email / numbers / special chars
  if (!nameRegex.test(form.name)) {
    alert("Only name is allowed (letters only). No numbers, email or special characters!");
    return;
  }

  // login
  login({
    name: form.name.trim()
  });

  // clear fields
  setForm({
    name: "",
    password: ""
  });

  navigate("/");
};

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to continue shopping</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <p className="footer-text">
          Don't have an account? <span>Sign Up</span>
        </p>
      </div>
    </div>
  );
}