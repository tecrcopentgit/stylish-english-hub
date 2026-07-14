import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// 1. Check for the string or provide a safe placeholder URI to bypass build crashes
const databaseUrl = process.env.DATABASE_URL || "postgresql://mock_user:mock_pass@localhost:5432/mock_db";

if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  console.warn("⚠️ Warning: DATABASE_URL environment variable is missing during build time.");
}

// 2. Safely initialize the client connection
const client = neon(databaseUrl);
export const db = drizzle({ client });
