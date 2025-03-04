"use client";

import { useState } from "react";
import Link from 'next/link';
import { useAuth } from "./AuthProvider";

import LoginForm from "@/app/components/LoginForm";
import RegisterForm from "@/app/components/RegisterForm";
import LogoutButton from "@/app/components/LogoutButton";

import CampaignList from "@/app/components/CampaignList";

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
            <nav>
              <Link href='/campaigns'>Campaigns</Link>  
            </nav>
            <CampaignList />
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
