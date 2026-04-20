import React, { useState, useEffect } from "react";
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

  // ✅ AUTO REDIRECT IF LOGGED IN
  useEffect(() => {
    if (user || localStorage.getItem("userId")) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!form.name || !form.password) {
      alert("Please fill all fields");
      return;
    }

    if (!nameRegex.test(form.name)) {
      alert("Only letters allowed in name");
      return;
    }

    // 🔥 FAKE USER ID GENERATION (TEMP FIX)
    const fakeUser = {
      _id: Date.now().toString(), // temporary unique id
      name: form.name.trim(),
    };

    // 🔐 SAVE IN CONTEXT
    login(fakeUser);

    // 🔥 SAVE IN LOCALSTORAGE (IMPORTANT FIX)
    localStorage.setItem("userId", fakeUser._id);
    localStorage.setItem("userName", fakeUser.name);

    // clear form
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