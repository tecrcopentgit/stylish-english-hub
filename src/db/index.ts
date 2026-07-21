
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { sql as drizzleSqlHelper } from "drizzle-orm";

// 1. EMBEDDED PRODUCTION CONNECTION STRING
const DATABASE_URL = "postgresql://neondb_owner:npg_WdLYJcXm6g1r@ep-young-river-ahzoi6r4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// 2. SAFE CLIENT INITIALIZATION
const client = neon(DATABASE_URL);
export const db = drizzle(client);

// 3. NEXT.JS SERVER ACTION FOR FETCHING DATA
export async function getData() {
  try {
    // Executes raw SQL templates safely using the unified client
    const data = await db.execute(drizzleSqlHelper`SELECT * FROM your_table_name`);
    
    return { success: true, data: data.rows };
  } catch (error) {
    console.error("Database query failed:", error);
    return { success: false, error: "Failed to fetch data" };
  }
}

// 4. SERVER ACTION: SAVE WHATSAPP FORM DATA TO DATABASE
export async function saveEnquiry(formData: {
  studentName: string;
  parentName: string;
  className: string;
  phone: string;
  program?: string;
  shift?: string;
  message?: string;
}) {
  try {
    // Executes raw SQL insert query matching your React form layout
    await db.execute(drizzleSqlHelper`
      INSERT INTO enquiries (student_name, parent_name, class_name, phone, program, shift, message)
      VALUES (${formData.studentName}, ${formData.parentName}, ${formData.className}, ${formData.phone}, ${formData.program || null}, ${formData.shift || null}, ${formData.message || null})
    `);
    
    return { success: true };
  } catch (error) {
    console.error("Failed to save enquiry:", error);
    return { success: false, error: "Failed to save submission" };
  }
}
