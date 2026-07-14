import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { payments, students } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const paymentList = await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt));

    return NextResponse.json({ payments: paymentList });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Get student details
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, parseInt(body.studentId)))
      .limit(1);

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Generate receipt number
    const year = new Date().getFullYear();
    const receiptNumber = `SEA-${year}-${nanoid(6).toUpperCase()}`;

    const [newPayment] = await db.insert(payments).values({
      receiptNumber,
      paymentDate: new Date().toISOString().split('T')[0],
      studentId: parseInt(body.studentId),
      studentName: student.studentName,
      className: student.className,
      feeMonth: body.feeMonth,
      monthlyFee: body.monthlyFee,
      previousBalance: body.previousBalance || '0',
      discount: body.discount || '0',
      amountPaid: body.amountPaid,
      pendingBalance: body.pendingBalance || '0',
      paymentStatus: body.paymentStatus,
      paymentMethod: body.paymentMethod,
      receivedBy: body.receivedBy || session.name,
      remarks: body.remarks || null,
    }).returning();

    return NextResponse.json({ success: true, payment: newPayment });
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}
