import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/db/auth';
import { db } from '@/db';
import { attendance } from '@/db/schema';
import { and, eq, SQL } from 'drizzle-orm'; // ✅ Added imports

export async function POST(request: NextRequest) {
  const session = await getSessionUser();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { date, className, shift, attendance: attendanceData, markedBy } = body;

    // Insert attendance records
    for (const record of attendanceData) {
      await db.insert(attendance).values({
        date,
        studentId: record.studentId,
        studentName: record.studentName,
        className,
        shift,
        status: record.status,
        markedBy: markedBy || session.full_name || 'Staff',
        remarks: record.remarks || null,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving attendance:', error);
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getSessionUser();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const className = searchParams.get('class');
  const shift = searchParams.get('shift');

  try {
    // ✅ FIXED: Build conditions array instead of reassigning query
    const conditions: SQL[] = [];

    if (date) {
      conditions.push(eq(attendance.date, date));
    }
    if (className) {
      conditions.push(eq(attendance.className, className));
    }
    if (shift) {
      conditions.push(eq(attendance.shift, shift));
    }

    const records = await db
      .select()
      .from(attendance)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json({ attendance: records });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}