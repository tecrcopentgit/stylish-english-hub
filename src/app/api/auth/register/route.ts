import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

// ⚠️ In real deployment load only from process.env.DATABASE_URL
const DB_URL = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_WdLYJcXm6g1r@ep-young-river-ahzoi6r4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, password } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // 1. Check if email already exists in Neon DB
    const checkRes = await pool.query(
      'SELECT id FROM staff WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (checkRes.rowCount && checkRes.rowCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // 2. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insert new staff record
    const insertRes = await pool.query(
      `INSERT INTO staff 
       (email, password_hash, full_name, role, created_at) 
       VALUES ($1, $2, $3, $4, NOW()) 
       RETURNING id, email, full_name, role`,
      [email.trim().toLowerCase(), passwordHash, fullName.trim(), 'staff']
    );

    const newUser = insertRes.rows[0];

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.full_name,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Register DB Error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}