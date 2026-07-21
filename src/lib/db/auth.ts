"use server";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL || "";
if (!DATABASE_URL) throw new Error("DATABASE_URL missing");

const db = drizzle(neon(DATABASE_URL));

export interface StaffRow {
  id: string;
  email: string;
  role: string;
  password_hash?: string;
  created_at?: Date;
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;
    if (!token) return null;
    const [userId, role] = token.split(":");
    if (!userId || !role) return null;
    const result = await db.execute(sql`
      SELECT id, email, role FROM staff WHERE id = ${userId} AND role = ${role} LIMIT 1
    `);
    return (result.rows[0] as StaffRow) || null;
  } catch {
    return null;
  }
}

export async function registerUser(credentials: {
  email: string;
  password: string;
  fullName?: string;
  role?: string;
}) {
  try {
    const { email, password, role = "staff" } = credentials;
    const existing = await db.execute(sql`
      SELECT id FROM staff WHERE email = ${email.toLowerCase().trim()} LIMIT 1
    `);
    if (existing.rows.length > 0) {
      return { success: false, error: "Email already registered" };
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await db.execute(sql`
      INSERT INTO staff (email, password_hash, role, created_at)
      VALUES (${email.toLowerCase().trim()}, ${hash}, ${role}, NOW())
      RETURNING id, email, role, created_at
    `);
    const user = result.rows[0] as StaffRow;

    (await cookies()).set("auth_session", `${user.id}:${user.role}`, {
      httpOnly: true,
      secure: false, // <-- CHANGED: false for localhost HTTP
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, user: { ...user, name: "Staff" } };
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return { success: false, error: err?.message || "Registration failed" };
  }
}

export async function loginUser(credentials: { email: string; password: string }) {
  try {
    const { email, password } = credentials;
    const result = await db.execute(sql`
      SELECT * FROM staff WHERE email = ${email.toLowerCase().trim()} LIMIT 1
    `);
    const staff = result.rows[0] as (StaffRow & { password_hash?: string }) | undefined;
    if (!staff) return { success: false, error: "Invalid credentials" };

    let match = false;
    if (staff.password_hash) {
      if (staff.password_hash.startsWith("$2") || staff.password_hash.length > 30) {
        match = await bcrypt.compare(password, staff.password_hash);
      } else {
        match = password === staff.password_hash;
      }
    }

    if (!match) return { success: false, error: "Invalid credentials" };

    (await cookies()).set("auth_session", `${staff.id}:${staff.role}`, {
      httpOnly: true,
      secure: false, // <-- CHANGED: false for localhost HTTP
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      user: {
        id: staff.id,
        email: staff.email,
        name: "Staff",
        role: staff.role,
      },
    };
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return { success: false, error: err?.message || "Login failed" };
  }
}

export async function logoutUser() {
  (await cookies()).delete("auth_session");
  return { success: true };
}