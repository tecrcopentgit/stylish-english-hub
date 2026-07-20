"use server";

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { cookies } from "next/headers";

// 1. EMBEDDED PRODUCTION NEON CONNECTION STRING
const DATABASE_URL = "postgresql://neondb_owner:npg_WdLYJcXm6g1r@ep-young-river-ahzoi6r4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const db = drizzle(neon(DATABASE_URL));

// 2. HELPER: NATIVE WEB CRYPTO HASHING (No external packages needed)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// 3. SERVER ACTION: CURRENT USER CHECK
export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("auth_session")?.value;
    if (!sessionToken) return null;

    // Decode mock session payload (user_id:role)
    const [userId, role] = sessionToken.split(":");
    
    const result = await db.execute(sql`
      SELECT id, email, name, role FROM users WHERE id = ${parseInt(userId)} LIMIT 1
    `);
    
    return result.rows[0] || null;
  } catch {
    return null;
  }
}

// 4. SERVER ACTION: REGISTRATION / SIGNUP
export async function registerUser(credentials: any) {
  try {
    const { email, password, name, role = "teacher" } = credentials;
    const hashedPassword = await hashPassword(password);

    // Check if user already exists
    const existing = await db.execute(sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`);
    if (existing.rows.length > 0) {
      return { success: false, error: "Email already registered" };
    }

    // Insert user into table
    const result = await db.execute(sql`
      INSERT INTO users (email, password, name, role)
      VALUES (${email}, ${hashedPassword}, ${name}, ${role})
      RETURNING id, email, name, role
    `);

    const newUser = result.rows[0];
    
    // Set HTTP-only login session cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_session", `${newUser.id}:${newUser.role}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Registration failed" };
  }
}

// 5. SERVER ACTION: LOGIN
export async function loginUser(credentials: any) {
  try {
    const { email, password } = credentials;
    const hashedPassword = await hashPassword(password);

    const result = await db.execute(sql`
      SELECT id, email, name, role, password FROM users WHERE email = ${email} LIMIT 1
    `);

    const user = result.rows[0];
    if (!user || user.password !== hashedPassword) {
      return { success: false, error: "Invalid email or password" };
    }

    // Clear password hash before passing to frontend
    delete user.password;

    const cookieStore = await cookies();
    cookieStore.set("auth_session", `${user.id}:${user.role}`, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login process failed" };
  }
}

// 6. SERVER ACTION: LOGOUT
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_session");
  return { success: true };
}
