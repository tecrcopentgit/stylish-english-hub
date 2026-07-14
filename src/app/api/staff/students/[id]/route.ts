import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, parseInt(id)))
      .limit(1);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ student });
  } catch (error) {
    console.error('Error fetching student:', error);
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const [updatedStudent] = await db
      .update(students)
      .set({
        admissionNumber: body.admissionNumber,
        studentName: body.studentName,
        parentName: body.parentName,
        className: body.className,
        schoolName: body.schoolName || null,
        shift: body.shift,
        phoneNumber: body.phoneNumber,
        whatsappNumber: body.whatsappNumber || null,
        monthlyFee: body.monthlyFee,
        joiningDate: body.joiningDate,
        notes: body.notes || null,
        updatedAt: new Date(),
      })
      .where(eq(students.id, parseInt(id)))
      .returning();

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
