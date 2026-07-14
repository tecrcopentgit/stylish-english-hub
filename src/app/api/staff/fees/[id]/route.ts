import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { feeStructure } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Prevents Next.js from evaluating database logic during static build compilation
export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();

    const [updatedFee] = await db
      .update(feeStructure)
      .set({
        monthlyFee: body.monthlyFee || '0',
        admissionFee: body.admissionFee || '0',
        materialFee: body.materialFee || '0',
        otherFee: body.otherFee || '0',
        totalFee: body.totalFee || '0',
        effectiveDate: body.effectiveDate,
        notes: body.notes || null,
        updatedAt: new Date(),
      })
      .where(eq(feeStructure.id, parseInt(id)))
      .returning();

    return NextResponse.json({ success: true, fee: updatedFee });
  } catch (error) {
    console.error('Error updating fee structure:', error);
    return NextResponse.json({ error: 'Failed to update fee structure' }, { status: 500 });
  }
}
