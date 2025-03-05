"use server";

import { cookies } from "next/headers";

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "chargen_authToken_server",
    value: "",
    maxAge: 0,
    httpOnly: true,
    path: "/",
    sameSite: "Strict",
  });

  return { message: "Logged out successfully" };
}
