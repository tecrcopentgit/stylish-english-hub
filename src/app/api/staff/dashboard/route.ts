import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { students, attendance, payments } from '@/db/schema';
import { eq, sql, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const today = new Date().toISOString().split('T')[0];

    // Get total active students
    const totalStudentsResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(students)
      .where(eq(students.status, 'active'));
    const totalStudents = totalStudentsResult[0]?.count || 0;

    // Get today's attendance stats
    const attendanceStats = await db
      .select({
        status: attendance.status,
        count: sql<number>`cast(count(*) as integer)`,
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
          presentToday = Number(stat.count) || 0;
          break;
        case 'A':
          absentToday = Number(stat.count) || 0;
          break;
        case 'L':
          leaveToday = Number(stat.count) || 0;
          break;
        case 'LT':
          lateToday = Number(stat.count) || 0;
          break;
      }
    }

    const markedToday = presentToday + absentToday + leaveToday + lateToday;
    const notMarked = totalStudents - markedToday;

    // Get current month's fee collection
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const feesResult = await db
      .select({ total: sql<number>`cast(COALESCE(SUM(amount_paid), 0) as numeric)` })
      .from(payments)
      .where(sql`to_char(payment_date, 'YYYY-MM') = ${currentMonth}`);
    const feesCollected = feesResult[0]?.total || 0;

    // Get pending payments count
    const pendingCountResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(payments)
      .where(eq(payments.paymentStatus, 'pending'));
    const pendingFees = pendingCountResult[0]?.count || 0;

    // Get total pending amount
    const totalPendingResult = await db
      .select({ total: sql<number>`cast(COALESCE(SUM(pending_balance), 0) as numeric)` })
      .from(payments)
      .where(sql`pending_balance > 0`);
    const totalPending = totalPendingResult[0]?.total || 0;

    return NextResponse.json({
      totalStudents,
      presentToday,
      absentToday,
      leaveToday,
      notMarked: Math.max(0, notMarked),
      feesCollected: Number(feesCollected),
      pendingFees: Number(pendingFees),
      totalPending: Number(totalPending),
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
    }, { status: 500 }); // Return a 500 error status rather than hiding errors behind a fake 200 payload
  }
}
