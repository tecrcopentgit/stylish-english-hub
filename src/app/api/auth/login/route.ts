import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { staff } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/db/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find staff by email
    const [staffMember] = await db
      .select()
      .from(staff)
      .where(eq(staff.email, email.toLowerCase()))
      .limit(1);

    if (!staffMember) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check active status (optional - remove if your schema doesn't have is_active)
    if ('is_active' in staffMember && !staffMember.is_active) {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 401 }
      );
    }

    // Verify password using snake_case field name
    const isValid = await verifyPassword(password, staffMember.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create token
    const token = await createToken({
      id: staffMember.id,
      email: staffMember.email,
      name: staffMember.full_name, // ✅ fixed: full_name not name
      role: staffMember.role,
    });

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: staffMember.id,
        email: staffMember.email,
        name: staffMember.full_name || 'Staff', // ✅ fixed: full_name not name
        role: staffMember.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}