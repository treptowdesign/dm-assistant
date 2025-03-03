"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedData = getCookie("chargen_authToken_client");

    if (storedData && typeof storedData === "string") {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData?.user && parsedData?.token) {
          setUser(parsedData.user);
          setToken(parsedData.token);
        }
      } catch (error) {
        console.error("Error parsing auth token from cookie:", error);
      }
    }
    setAuthLoading(false);
  }, []);

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    setCookie("chargen_authToken_client", JSON.stringify({ user, token }), {
      maxAge: 60 * 60 * 24, // 1-day expiration
      httpOnly: false,
    });
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    setToken(null);
    deleteCookie("chargen_authToken_client");
  };

  return (
    <AuthContext.Provider value={{ user, token, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
