import { pgTable, serial, varchar, text, integer, decimal, timestamp, date, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const studentStatusEnum = pgEnum('student_status', ['active', 'inactive', 'discontinued']);
export const attendanceStatusEnum = pgEnum('attendance_status', ['P', 'A', 'L', 'LT']);
export const paymentStatusEnum = pgEnum('payment_status', ['paid', 'partially_paid', 'pending', 'advance_paid']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'upi', 'bank_transfer', 'other']);
export const messageStatusEnum = pgEnum('message_status', ['generated', 'opened', 'confirmed_sent']);
export const staffRoleEnum = pgEnum('staff_role', ['admin', 'teacher', 'account_staff']);

// Staff table for authentication
export const staff = pgTable('staff', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: staffRoleEnum('role').notNull().default('teacher'),
  phone: varchar('phone', { length: 20 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Students table
export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  admissionNumber: varchar('admission_number', { length: 50 }).notNull().unique(),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  parentName: varchar('parent_name', { length: 255 }).notNull(),
  className: varchar('class_name', { length: 50 }).notNull(),
  schoolName: varchar('school_name', { length: 255 }),
  shift: varchar('shift', { length: 50 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  whatsappNumber: varchar('whatsapp_number', { length: 20 }),
  monthlyFee: decimal('monthly_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  joiningDate: date('joining_date').notNull(),
  status: studentStatusEnum('status').notNull().default('active'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Attendance table
export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  studentId: integer('student_id').notNull().references(() => students.id),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  className: varchar('class_name', { length: 50 }).notNull(),
  shift: varchar('shift', { length: 50 }).notNull(),
  status: attendanceStatusEnum('status').notNull(),
  markedBy: varchar('marked_by', { length: 255 }).notNull(),
  markedAt: timestamp('marked_at').notNull().defaultNow(),
  remarks: text('remarks'),
});

// Attendance Message History
export const attendanceMessages = pgTable('attendance_messages', {
  id: serial('id').primaryKey(),
  date: date('date').notNull(),
  className: varchar('class_name', { length: 50 }).notNull(),
  shift: varchar('shift', { length: 50 }).notNull(),
  teacherName: varchar('teacher_name', { length: 255 }).notNull(),
  totalStudents: integer('total_students').notNull(),
  presentCount: integer('present_count').notNull(),
  absentCount: integer('absent_count').notNull(),
  leaveCount: integer('leave_count').notNull(),
  lateCount: integer('late_count').notNull(),
  message: text('message').notNull(),
  whatsappDestination: varchar('whatsapp_destination', { length: 255 }),
  messageStatus: messageStatusEnum('message_status').notNull().default('generated'),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Fee Structure
export const feeStructure = pgTable('fee_structure', {
  id: serial('id').primaryKey(),
  className: varchar('class_name', { length: 50 }).notNull().unique(),
  monthlyFee: decimal('monthly_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  admissionFee: decimal('admission_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  materialFee: decimal('material_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  otherFee: decimal('other_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  totalFee: decimal('total_fee', { precision: 10, scale: 2 }).notNull().default('0'),
  effectiveDate: date('effective_date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Student Payments
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  receiptNumber: varchar('receipt_number', { length: 50 }).notNull().unique(),
  paymentDate: date('payment_date').notNull(),
  studentId: integer('student_id').notNull().references(() => students.id),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  className: varchar('class_name', { length: 50 }).notNull(),
  feeMonth: varchar('fee_month', { length: 50 }).notNull(),
  monthlyFee: decimal('monthly_fee', { precision: 10, scale: 2 }).notNull(),
  previousBalance: decimal('previous_balance', { precision: 10, scale: 2 }).notNull().default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).notNull().default('0'),
  amountPaid: decimal('amount_paid', { precision: 10, scale: 2 }).notNull(),
  pendingBalance: decimal('pending_balance', { precision: 10, scale: 2 }).notNull().default('0'),
  paymentStatus: paymentStatusEnum('payment_status').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  receivedBy: varchar('received_by', { length: 255 }).notNull(),
  remarks: text('remarks'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Payment Message History
export const paymentMessages = pgTable('payment_messages', {
  id: serial('id').primaryKey(),
  receiptNumber: varchar('receipt_number', { length: 50 }).notNull(),
  studentId: integer('student_id').notNull().references(() => students.id),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  parentWhatsapp: varchar('parent_whatsapp', { length: 20 }),
  message: text('message').notNull(),
  messageStatus: messageStatusEnum('message_status').notNull().default('generated'),
  createdBy: varchar('created_by', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Enquiries
export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  studentName: varchar('student_name', { length: 255 }).notNull(),
  parentName: varchar('parent_name', { length: 255 }).notNull(),
  className: varchar('class_name', { length: 50 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 20 }).notNull(),
  interestedProgram: varchar('interested_program', { length: 255 }),
  preferredShift: varchar('preferred_shift', { length: 50 }),
  message: text('message'),
  status: varchar('status', { length: 50 }).notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Type exports
export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;
export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
export type AttendanceMessage = typeof attendanceMessages.$inferSelect;
export type FeeStructure = typeof feeStructure.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type PaymentMessage = typeof paymentMessages.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;
