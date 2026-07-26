import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

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