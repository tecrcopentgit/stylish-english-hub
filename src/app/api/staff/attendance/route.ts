import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/db/auth';
import { db } from '@/db';
import { attendance } from '@/db/schema';

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
        markedBy: markedBy || session.full_name || 'Staff', // ✅ Use full_name not name
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
  const session = await getSessionUser(); // ✅ Fixed: was getSession (doesn't exist)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const className = searchParams.get('class');
  const shift = searchParams.get('shift');

  try {
    let query = db.select().from(attendance);

    // Filter logic would go here with proper where clauses
    if (date) {
      query = query.where(eq(attendance.date, date));
    }
    if (className) {
      query = query.where(eq(attendance.className, className));
    }
    if (shift) {
      query = query.where(eq(attendance.shift, shift));
    }

    const records = await query;

    return NextResponse.json({ attendance: records });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}