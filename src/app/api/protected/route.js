import { NextResponse } from 'next/server';
import { getUserFromServer } from "@/app/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromServer();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({
      message: 'Protected route accessed successfully!',
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error('Auth Error:', error);
    return NextResponse.json({ error: 'Auth Error' }, { status: 401 });
  }
}
