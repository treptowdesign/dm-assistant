"use server";

import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/models/prismaClient";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) throw new Error("Missing JWT_SECRET in environment variables");

export async function registerUser(email, password) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, {
      expiresIn: "1d",
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "chargen_authToken_server",
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "Strict",
    });

    return { user: newUser, token };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Internal server error" };
  }
}
