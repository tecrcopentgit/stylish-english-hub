// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/db/auth';

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Return the user data to the frontend
  return NextResponse.json({
    success: true,
    user: {
      id: session.userId,
      email: session.email,
      role: session.role,
    }
  });
}