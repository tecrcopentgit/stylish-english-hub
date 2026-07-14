import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { feeStructure } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const fees = await db
      .select()
      .from(feeStructure)
      .orderBy(asc(feeStructure.className));

    return NextResponse.json({ fees });
  } catch (error) {
    console.error('Error fetching fee structures:', error);
    return NextResponse.json({ error: 'Failed to fetch fee structures' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const [newFee] = await db.insert(feeStructure).values({
      className: body.className,
      monthlyFee: body.monthlyFee || '0',
      admissionFee: body.admissionFee || '0',
      materialFee: body.materialFee || '0',
      otherFee: body.otherFee || '0',
      totalFee: body.totalFee || '0',
      effectiveDate: body.effectiveDate,
      notes: body.notes || null,
    }).returning();

    return NextResponse.json({ success: true, fee: newFee });
  } catch (error) {
    console.error('Error creating fee structure:', error);
    return NextResponse.json({ error: 'Failed to create fee structure' }, { status: 500 });
  }
}
