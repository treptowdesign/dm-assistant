"use client";

import { useAuth } from "./AuthProvider";

export default function LogoutButton() {
  const { user, logout } = useAuth();

  return <button onClick={logout}>{user ? `Logout (${user.email})` : "Logout"}</button>;
}
