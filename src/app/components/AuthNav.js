"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";

import LoginForm from "@/app/components/LoginForm";
import RegisterForm from "@/app/components/RegisterForm";
import LogoutButton from "@/app/components/LogoutButton";

export default function AuthNav() {
  const { user, authLoading } = useAuth();
  const [displayLogin, setDisplayLogin] = useState(true);

  const toggleLogin = () => {
    setDisplayLogin(!displayLogin);
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav>
      <div>
        {user ? (
          <>
            <LogoutButton />
          </>
        ) : (
          <>
            {displayLogin ? <LoginForm /> : <RegisterForm />}
            <button onClick={toggleLogin}>
              {displayLogin ? "Create a new user" : "Login existing user"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
