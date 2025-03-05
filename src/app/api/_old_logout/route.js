import { NextResponse } from 'next/server';

export async function POST() {
  // clear cookie via expired date
  const response = NextResponse.json({ message: 'Logged out successfully' });

  response.headers.set(
    'Set-Cookie',
    'chargen_authToken_server=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict'
  );

  console.log('Logout: Server-side cookie cleared');

  return response;
}
