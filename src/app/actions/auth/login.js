"use server";

import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/models/prismaClient";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) throw new Error("Missing JWT_SECRET in environment variables");

export async function loginUser(email, password) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { error: "Invalid credentials" };
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1d",
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "chargen_authToken_server",
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "Strict",
    });

    return { user, token };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Internal server error" };
  }
}
