import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  // 🔐 Load user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error("Invalid user in localStorage");
      return null;
    }
  });

  // ✅ LOGIN (FIXED)
  const login = (userData) => {

    // 👉 IMPORTANT FIX: keep same user structure always
    const userWithId = {
      _id: userData._id || Date.now().toString(), // fallback only
      name: userData.name,
    };

    setUser(userWithId);

    localStorage.setItem("user", JSON.stringify(userWithId));

    // 🔥 ALSO STORE FOR CART SYSTEM (IMPORTANT)
    localStorage.setItem("userId", userWithId._id);
    localStorage.setItem("userName", userWithId.name);
  };

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🧠 CUSTOM HOOK
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};