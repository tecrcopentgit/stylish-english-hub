"use server";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL || "";
if (!DATABASE_URL) throw new Error("DATABASE_URL missing");

export const db = drizzle(neon(DATABASE_URL));

export interface StaffRow {
  id: string;
  email: string;
  role: string;
  full_name?: string;
  password_hash?: string;
  created_at?: Date;
}

// ─── COMPATIBILITY ALIASES (fixes build errors) ────────────────────────────

// Alias: getSession → getSessionUser
export async function getSession() {
  return getSessionUser();
}

// Alias: createToken (simple cookie-based token string)
export async function createToken(payload: {
  id: string;
  role: string;
  email?: string;
}): Promise<string> {
  return `${payload.id}:${payload.role}`;
}

// Alias: setAuthCookie
export async function setAuthCookie(token: string): Promise<void> {
  const isProd = process.env.NODE_ENV === "production";
  (await cookies()).set("auth_session", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// Alias: clearAuthCookie
export async function clearAuthCookie(): Promise<void> {
  (await cookies()).delete("auth_session");
}

// Alias: verifyPassword
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (!hash) return false;
  // Support both bcrypt and plain-text (legacy) passwords
  if (hash.startsWith("$2") || hash.length > 30) {
    return bcrypt.compare(password, hash);
  }
  return password === hash;
}

// ─── SHARED ────────────────────────────────────────────────

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;
    if (!token) return null;
    const [userId, role] = token.split(":");
    if (!userId || !role) return null;

    const result = await db.execute(sql`
      SELECT id, email, role, full_name 
      FROM staff 
      WHERE id = ${userId} AND role = ${role} 
      LIMIT 1
    `);
    return (result.rows[0] as unknown as StaffRow) || null;
  } catch {
    return null;
  }
}

export async function logoutUser() {
  (await cookies()).delete("auth_session");
  return { success: true };
}

// ─── STAFF AUTH ────────────────────────────────────────────

export async function registerUser(credentials: {
  email: string;
  password: string;
  fullName?: string;
}) {
  try {
    const { email, password, fullName } = credentials;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db.execute(sql`
      SELECT id FROM staff WHERE email = ${normalizedEmail} LIMIT 1
    `);
    if (existing.rows.length > 0) {
      return { success: false, error: "Email already registered" };
    }

    const hash = await bcrypt.hash(password, 10);
    const role = "staff";

    const result = await db.execute(sql`
      INSERT INTO staff (email, password_hash, role, full_name, created_at)
      VALUES (${normalizedEmail}, ${hash}, ${role}, ${fullName || null}, NOW())
      RETURNING id, email, role, full_name, created_at
    `);
    const user = (result.rows[0] as unknown as StaffRow) || null;

    const isProd = process.env.NODE_ENV === "production";
    (await cookies()).set("auth_session", `${user.id}:${user.role}`, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || "Staff",
        role: user.role,
      },
    };
  } catch (err: any) {
    console.error("STAFF REGISTER ERROR:", err);
    return { success: false, error: err?.message || "Registration failed" };
  }
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    const { email, password } = credentials;
    const normalizedEmail = email.toLowerCase().trim();

    const result = await db.execute(sql`
      SELECT * FROM staff WHERE email = ${normalizedEmail} LIMIT 1
    `);
    // ✅ Fixed: Added 'as unknown' before casting
    const staff = result.rows[0] as unknown as (StaffRow & { password_hash?: string }) | undefined;
    if (!staff) return { success: false, error: "Invalid credentials" };

    const match = await verifyPassword(password, staff.password_hash || "");
    if (!match) return { success: false, error: "Invalid credentials" };

    const isProd = process.env.NODE_ENV === "production";
    (await cookies()).set("auth_session", `${staff.id}:${staff.role}`, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      user: {
        id: staff.id,
        email: staff.email,
        name: staff.full_name || "Staff",
        role: staff.role,
      },
    };
  } catch (err: any) {
    console.error("STAFF LOGIN ERROR:", err);
    return { success: false, error: err?.message || "Login failed" };
  }
}

// ─── ADMIN AUTH ────────────────────────────────────────────

export async function getSessionAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_session")?.value;
    if (!token) return null;
    const [userId, role] = token.split(":");
    if (!userId || role !== "admin") return null;

    const result = await db.execute(sql`
      SELECT id, email, role, full_name 
      FROM staff 
      WHERE id = ${userId} AND role = 'admin' 
      LIMIT 1
    `);
    // ✅ Fixed: Added 'as unknown' before casting
    return (result.rows[0] as unknown as StaffRow) || null;
  } catch {
    return null;
  }
}

export async function registerAdmin(credentials: {
  email: string;
  password: string;
  fullName?: string;
  inviteCode: string;
}) {
  try {
    const ADMIN_INVITE_CODE = process.env.ADMIN_INVITE_CODE || "";
    if (!ADMIN_INVITE_CODE) {
      return { success: false, error: "Admin registration is not configured" };
    }
    if (credentials.inviteCode.trim() !== ADMIN_INVITE_CODE) {
      return { success: false, error: "Invalid invite code" };
    }

    const { email, password, fullName } = credentials;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db.execute(sql`
      SELECT id, role FROM staff WHERE email = ${normalizedEmail} LIMIT 1
    `);
    if (existing.rows.length > 0) {
      // ✅ Fixed: Added 'as unknown' before casting
      const existingRole = (existing.rows[0] as unknown as StaffRow).role;
      if (existingRole === "admin") {
        return {
          success: false,
          error: "Admin account already exists for this email",
        };
      }
      return { success: false, error: "Email already registered as staff" };
    }

    const hash = await bcrypt.hash(password, 12);
    const role = "admin";

    const result = await db.execute(sql`
      INSERT INTO staff (email, password_hash, role, full_name, created_at)
      VALUES (${normalizedEmail}, ${hash}, ${role}, ${fullName || null}, NOW())
      RETURNING id, email, role, full_name, created_at
    `);
    // ✅ Fixed: Added 'as unknown' before casting
    const user = result.rows[0] as unknown as StaffRow;

    const isProd = process.env.NODE_ENV === "production";
    (await cookies()).set("auth_session", `${user.id}:${user.role}`, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name || "Admin",
        role: user.role,
      },
    };
  } catch (err: any) {
    console.error("ADMIN REGISTER ERROR:", err);
    return { success: false, error: err?.message || "Registration failed" };
  }
}

export async function loginAdmin(credentials: {
  email: string;
  password: string;
}) {
  try {
    const { email, password } = credentials;
    const normalizedEmail = email.toLowerCase().trim();

    const result = await db.execute(sql`
      SELECT * FROM staff 
      WHERE email = ${normalizedEmail} AND role = 'admin' 
      LIMIT 1
    `);
    // ✅ Fixed: Added 'as unknown' before casting
    const admin = result.rows[0] as unknown as (StaffRow & { password_hash?: string }) | undefined;
    if (!admin) return { success: false, error: "Invalid admin credentials" };

    const match = await verifyPassword(password, admin.password_hash || "");
    if (!match) return { success: false, error: "Invalid admin credentials" };

    const isProd = process.env.NODE_ENV === "production";
    (await cookies()).set("auth_session", `${admin.id}:${admin.role}`, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.full_name || "Admin",
        role: admin.role,
      },
    };
  } catch (err: any) {
    console.error("ADMIN LOGIN ERROR:", err);
    return { success: false, error: err?.message || "Login failed" };
  }
}

export async function logoutAdmin() {
  (await cookies()).delete("auth_session");
  return { success: true };
}