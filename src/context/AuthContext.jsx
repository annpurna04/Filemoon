import React, { createContext, useState, useEffect } from "react";
import { api } from "../api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setUser(null);
        localStorage.removeItem("token");
        return;
      }

      try {
        localStorage.setItem("token", token);

        // Call verify endpoint to get user info
        const res = await api.post("/token/verify", { token });

        // Set user from response
        setUser({
          email: res.data.email,
          name: res.data.fullname,
          mobile: res.data.mobile,
          id: res.data.id,
        });
      } catch (err) {
        console.error("Token invalid, logging out", err);
        logout();
      }
    };

    verifyToken();
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
