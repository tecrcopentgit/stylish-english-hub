import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import { cookies } from 'next/headers';

// ─── INLINE DB + AUTH (no external imports needed) ───

const DATABASE_URL = process.env.DATABASE_URL || '';
const db = drizzle(neon(DATABASE_URL));

async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;
    if (!token) return null;
    const [userId, role] = token.split(':');
    if (!userId || !role) return null;

    const result = await db.execute(sql`
      SELECT id, email, role, full_name
      FROM staff
      WHERE id = ${userId} AND role = ${role}
      LIMIT 1
    `);
    return result.rows[0] || null;
  } catch {
    return null;
  }
}

// ─── GET single student ───

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await db.execute(sql`
      SELECT * FROM students WHERE id = ${parseInt(id)} LIMIT 1
    `);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ student: result.rows[0] });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch student' },
      { status: 500 }
    );
  }
}

// ─── PUT update student ───

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const studentId = parseInt(id);

    await db.execute(sql`
      UPDATE students SET
        admission_number = ${body.admissionNumber},
        student_name = ${body.studentName},
        parent_name = ${body.parentName},
        class_name = ${body.className},
        school_name = ${body.schoolName || null},
        shift = ${body.shift},
        phone_number = ${body.phoneNumber},
        whatsapp_number = ${body.whatsappNumber || null},
        monthly_fee = ${body.monthlyFee},
        joining_date = ${body.joiningDate},
        notes = ${body.notes || null},
        updated_at = NOW()
      WHERE id = ${studentId}
    `);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update student' },
      { status: 500 }
    );
  }
}

// ─── DELETE student permanently ───

// ─── DELETE student permanently ───

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = parseInt(id);

    // 1. Check student exists
    const check = await db.execute(sql`
      SELECT id, student_name FROM students
      WHERE id = ${studentId} LIMIT 1
    `);

    if (check.rows.length === 0) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    const studentName = (check.rows[0] as any).student_name;

    // 2. Delete related records (skip if table doesn't exist)
    const relatedTables = [
      'attendance',
      'attendance_messages',
      'payment_messages',
      'payments',
    ];

    for (const table of relatedTables) {
      try {
        await db.execute(sql.raw(
          `DELETE FROM ${table} WHERE student_id = ${studentId}`
        ));
      } catch (err: any) {
        // Skip if table doesn't exist (error code 42P01)
        if (err?.cause?.code === '42P01' || err?.message?.includes('does not exist')) {
          console.log(`Table "${table}" does not exist — skipping`);
        } else {
          throw err; // Re-throw if it's a different error
        }
      }
    }

    // 3. Delete the student
    await db.execute(sql`
      DELETE FROM students WHERE id = ${studentId}
    `);

    console.log(
      `Student deleted: ${studentName} (ID: ${studentId}) by ${
        (session as any).email || 'staff'
      }`
    );

    return NextResponse.json({
      success: true,
      message: `Student ${studentName} has been permanently deleted`,
    });
  } catch (error: any) {
    console.error('DELETE student error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete student' },
      { status: 500 }
    );
  }
}