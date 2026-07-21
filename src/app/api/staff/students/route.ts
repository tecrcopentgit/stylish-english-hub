import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/db/auth'; // correct import
import { db } from '@/db';
import { students } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  const session = await getSessionUser();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const studentList = await db
      .select()
      .from(students)
      .orderBy(desc(students.createdAt));

    return NextResponse.json({ students: studentList });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionUser(); // fixed: was getSession
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const [newStudent] = await db.insert(students).values({
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
      status: 'active',
    }).returning();

    return NextResponse.json({ success: true, student: newStudent });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}