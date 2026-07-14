import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { enquiries } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { studentName, parentName, className, phone, program, shift, message } = body;

    // Validate required fields
    if (!studentName || !parentName || !className || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert enquiry into database
    const [newEnquiry] = await db.insert(enquiries).values({
      studentName,
      parentName,
      className,
      phoneNumber: phone,
      interestedProgram: program || null,
      preferredShift: shift || null,
      message: message || null,
      status: 'new',
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      id: newEnquiry.id,
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
