// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { logoutUser } from "@/lib/db/auth"; 

export async function POST() {
  await logoutUser();
  return NextResponse.json({ success: true });
}
