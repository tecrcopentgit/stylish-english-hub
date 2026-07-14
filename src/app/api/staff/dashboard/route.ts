import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, attendance, payments } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';

// Prevents Next.js from evaluating database logic during static build compilation
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // Get total active students
    const [{ count: totalStudents }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(students)
      .where(eq(students.status, 'active'));

    // Get today's attendance stats
    const attendanceStats = await db
      .select({
        status: attendance.status,
        count: sql<number>`count(*)`,
      })
      .from(attendance)
      .where(eq(attendance.date, today))
      .groupBy(attendance.status);

    let presentToday = 0;
    let absentToday = 0;
    let leaveToday = 0;
    let lateToday = 0;

    for (const stat of attendanceStats) {
      switch (stat.status) {
        case 'P':
          presentToday = Number(stat.count);
          break;
        case 'A':
          absentToday = Number(stat.count);
          break;
        case 'L':
          leaveToday = Number(stat.count);
          break;
        case 'LT':
          lateToday = Number(stat.count);
          break;
      }
    }

    const markedToday = presentToday + absentToday + leaveToday + lateToday;
    const notMarked = Number(totalStudents) - markedToday;

    // Get current month's fee collection
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const [{ total: feesCollected }] = await db
      .select({ total: sql<number>`COALESCE(SUM(amount_paid), 0)` })
      .from(payments)
      .where(sql`to_char(payment_date, 'YYYY-MM') = ${currentMonth}`);

    // Get pending payments count
    const [{ count: pendingFees }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(payments)
      .where(
        and(
          eq(payments.paymentStatus, 'pending'),
        )
      );

    // Get total pending amount
    const [{ total: totalPending }] = await db
      .select({ total: sql<number>`COALESCE(SUM(pending_balance), 0)` })
      .from(payments)
      .where(sql`pending_balance > 0`);

    return NextResponse.json({
      totalStudents: Number(totalStudents),
      presentToday,
      absentToday,
      leaveToday,
      notMarked: Math.max(0, notMarked),
      feesCollected: Number(feesCollected) || 0,
      pendingFees: Number(pendingFees) || 0,
      totalPending: Number(totalPending) || 0,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({
      totalStudents: 0,
      presentToday: 0,
      absentToday: 0,
      leaveToday: 0,
      notMarked: 0,
      feesCollected: 0,
      pendingFees: 0,
      totalPending: 0,
    });
  }
}
