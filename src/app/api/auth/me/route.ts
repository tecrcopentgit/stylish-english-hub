import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/db/auth'; // ✅ fixed: getSessionUser not getSession

export async function GET() {
  const session = await getSessionUser(); // ✅ fixed

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Not authenticated' },
      { status: 401 }
    );
  }

  // Return the user data to the frontend
  // Note: getSessionUser returns 'id', not 'userId'
  return NextResponse.json({
    success: true,
    user: {
      id: session.id,       // ✅ fixed: session.id (not session.userId)
      email: session.email,
      role: session.role,
      name: session.full_name || 'User', // optional: add name if your frontend expects it
    }
  });
}