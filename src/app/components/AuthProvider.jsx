"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromServer } from "@/app/actions/auth/getUser";
import { loginUser } from "@/app/actions/auth/login";
import { logoutUser } from "@/app/actions/auth/logout";
import { registerUser } from "@/app/actions/auth/register"; 

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const userData = await getUserFromServer();
      if (userData) setUser(userData);
      setAuthLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const result = await loginUser(email, password);
    if (!result.error) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const register = async (email, password) => {
    const result = await registerUser(email, password);
    if (!result.error) {
      setUser(result.user);
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, register }}>
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
