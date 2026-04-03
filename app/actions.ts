"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requirePermission } from "@/lib/auth";
import { getDatabase } from "@/lib/database";
import {
  APPOINTMENT_STATUSES,
  AppointmentStatus,
  LAB_ORDER_STATUSES,
  LabOrderStatus,
  PAYMENT_STATUSES,
  PaymentStatus,
  REPORT_VISIBILITIES,
  ReportVisibility
} from "@/lib/status-options";

const db = getDatabase();

function requireValue(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`Missing field: ${key}`);
  }

  return value;
}

function nextCode(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

async function upsertPatient({
  fullName,
  phone,
  email
}: {
  fullName: string;
  phone: string;
  email?: string;
}) {
  const existing = db.prepare("SELECT id, email FROM patients WHERE phone = ?").get(phone) as { id?: string; email?: string | null };

  if (existing?.id) {
    db.prepare("UPDATE patients SET full_name = ?, email = ?, updated_at = datetime('now') WHERE id = ?").run(
      fullName,
      email || existing.email || null,
      existing.id
    );
    return { id: existing.id };
  }

  const id = `patient-${crypto.randomUUID()}`;
  db.prepare(
    "INSERT INTO patients (id, registration, full_name, phone, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).run(id, nextCode("PAT"), fullName, phone, email || null);

  return { id };
}

function refreshOperationalViews() {
  [
    "/book-appointment",
    "/book-test",
    "/reports",
    "/admin",
    "/patient",
    "/doctor",
    "/lab",
    "/operations"
  ].forEach((path) => revalidatePath(path));
}

export async function createAppointmentAction(formData: FormData) {
  const fullName = requireValue(formData, "fullName");
  const phone = requireValue(formData, "phone");
  const email = String(formData.get("email") ?? "").trim();
  const doctorId = requireValue(formData, "doctorId");
  const date = requireValue(formData, "date");
  const time = requireValue(formData, "time");
  const visitType = requireValue(formData, "visitType");
  const notes = String(formData.get("notes") ?? "").trim();

  const patient = await upsertPatient({ fullName, phone, email });
  const doctor = db.prepare("SELECT consultation_fee AS consultationFee FROM doctors WHERE id = ?").get(doctorId) as {
    consultationFee?: number;
  };
  const appointmentId = `appt-${crypto.randomUUID()}`;
  db.prepare(
    `INSERT INTO appointments
     (id, booking_number, patient_id, doctor_id, appointment_date, status, visit_type, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'PENDING', ?, ?, datetime('now'), datetime('now'))`
  ).run(appointmentId, nextCode("APT"), patient.id, doctorId, `${date}T${time}:00`, visitType, notes || null);

  db.prepare(
    `INSERT INTO bills
     (id, bill_number, patient_id, appointment_id, amount, discount_amount, payment_status, issued_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, 'UNPAID', datetime('now'), datetime('now'), datetime('now'))`
  ).run(`bill-${crypto.randomUUID()}`, nextCode("BIL"), patient.id, appointmentId, doctor.consultationFee ?? 400);

  refreshOperationalViews();
  redirect(`/book-appointment?success=${encodeURIComponent("Appointment booked successfully.")}`);
}

export async function createLabOrderAction(formData: FormData) {
  const fullName = requireValue(formData, "fullName");
  const phone = requireValue(formData, "phone");
  const email = String(formData.get("email") ?? "").trim();
  const serviceId = requireValue(formData, "serviceId");
  const notes = String(formData.get("notes") ?? "").trim();

  const patient = await upsertPatient({ fullName, phone, email });
  const service = db.prepare("SELECT price FROM services WHERE id = ?").get(serviceId) as { price: number };
  const labOrderId = `lab-${crypto.randomUUID()}`;
  db.prepare(
    `INSERT INTO lab_orders
     (id, booking_number, patient_id, service_id, status, notes, booked_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, 'BOOKED', ?, datetime('now'), datetime('now'), datetime('now'))`
  ).run(labOrderId, nextCode("LAB"), patient.id, serviceId, notes || null);

  db.prepare(
    `INSERT INTO bills
     (id, bill_number, patient_id, lab_order_id, amount, discount_amount, payment_status, issued_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 0, 'UNPAID', datetime('now'), datetime('now'), datetime('now'))`
  ).run(`bill-${crypto.randomUUID()}`, nextCode("BIL"), patient.id, labOrderId, service.price);

  refreshOperationalViews();
  redirect(`/book-test?success=${encodeURIComponent("Lab booking created successfully.")}`);
}

export async function updateAppointmentStatusAction(formData: FormData) {
  await requirePermission("canManageBookings", "/operations");
  const appointmentId = requireValue(formData, "appointmentId");
  const status = requireValue(formData, "status");

  if (!APPOINTMENT_STATUSES.includes(status as AppointmentStatus)) {
    throw new Error("Invalid appointment status");
  }

  db.prepare("UPDATE appointments SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, appointmentId);

  refreshOperationalViews();
  redirect(String(formData.get("redirectTo") ?? "/admin"));
}

export async function updateLabOrderStatusAction(formData: FormData) {
  await requirePermission("canManageReports", "/lab");
  const labOrderId = requireValue(formData, "labOrderId");
  const status = requireValue(formData, "status");

  if (!LAB_ORDER_STATUSES.includes(status as LabOrderStatus)) {
    throw new Error("Invalid lab order status");
  }

  db.prepare(
    "UPDATE lab_orders SET status = ?, completed_at = CASE WHEN ? IN ('COMPLETED', 'REPORT_READY') THEN datetime('now') ELSE NULL END, updated_at = datetime('now') WHERE id = ?"
  ).run(status, status, labOrderId);

  refreshOperationalViews();
  redirect(String(formData.get("redirectTo") ?? "/lab"));
}

export async function updateBillPaymentAction(formData: FormData) {
  await requirePermission("canManageBilling", "/admin");
  const billId = requireValue(formData, "billId");
  const paymentStatus = requireValue(formData, "paymentStatus");

  if (!PAYMENT_STATUSES.includes(paymentStatus as PaymentStatus)) {
    throw new Error("Invalid payment status");
  }

  db.prepare("UPDATE bills SET payment_status = ?, updated_at = datetime('now') WHERE id = ?").run(paymentStatus, billId);

  refreshOperationalViews();
  redirect(String(formData.get("redirectTo") ?? "/admin"));
}

export async function createReportAction(formData: FormData) {
  await requirePermission("canManageReports", "/lab");
  const labOrderId = requireValue(formData, "labOrderId");
  const title = requireValue(formData, "title");
  const fileUrl = requireValue(formData, "fileUrl");
  const labOrder = db.prepare("SELECT patient_id AS patientId FROM lab_orders WHERE id = ?").get(labOrderId) as { patientId: string };

  db.prepare(
    `INSERT INTO reports
     (id, patient_id, lab_order_id, title, file_url, visibility, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'INTERNAL', datetime('now'), datetime('now'))`
  ).run(`report-${crypto.randomUUID()}`, labOrder.patientId, labOrderId, title, fileUrl);

  refreshOperationalViews();
  redirect(String(formData.get("redirectTo") ?? "/lab"));
}

export async function publishReportAction(formData: FormData) {
  await requirePermission("canManageReports", "/operations");
  const reportId = requireValue(formData, "reportId");
  const visibility = requireValue(formData, "visibility");

  if (!REPORT_VISIBILITIES.includes(visibility as ReportVisibility)) {
    throw new Error("Invalid report visibility");
  }

  db.prepare(
    "UPDATE reports SET visibility = ?, published_at = CASE WHEN ? = 'PUBLISHED' THEN datetime('now') ELSE NULL END, updated_at = datetime('now') WHERE id = ?"
  ).run(visibility, visibility, reportId);

  refreshOperationalViews();
  redirect(String(formData.get("redirectTo") ?? "/operations"));
}

export async function updateStaffPermissionsAction(formData: FormData) {
  await requirePermission("canManageStaff", "/admin");
  const staffId = requireValue(formData, "staffId");
  const roleLabel = requireValue(formData, "roleLabel");

  const has = (key: string) => (formData.get(key) ? 1 : 0);

  db.prepare(
    `UPDATE staff_users
     SET role_label = ?, is_active = ?, can_manage_staff = ?, can_edit_website = ?,
         can_manage_billing = ?, can_manage_reports = ?, can_manage_bookings = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    roleLabel,
    has("isActive"),
    has("canManageStaff"),
    has("canEditWebsite"),
    has("canManageBilling"),
    has("canManageReports"),
    has("canManageBookings"),
    staffId
  );

  refreshOperationalViews();
  redirect("/admin");
}

export async function createStaffUserAction(formData: FormData) {
  await requirePermission("canManageStaff", "/admin");
  const fullName = requireValue(formData, "fullName");
  const email = requireValue(formData, "email");
  const roleLabel = requireValue(formData, "roleLabel");

  db.prepare(
    `INSERT INTO staff_users
     (id, full_name, email, role_label, is_active, can_manage_staff, can_edit_website, can_manage_billing, can_manage_reports, can_manage_bookings, created_at, updated_at)
     VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  ).run(
    `staff-${crypto.randomUUID()}`,
    fullName,
    email,
    roleLabel,
    formData.get("canManageStaff") ? 1 : 0,
    formData.get("canEditWebsite") ? 1 : 0,
    formData.get("canManageBilling") ? 1 : 0,
    formData.get("canManageReports") ? 1 : 0,
    formData.get("canManageBookings") ? 1 : 0
  );

  refreshOperationalViews();
  redirect("/admin");
}

export async function updateSiteSettingsAction(formData: FormData) {
  await requirePermission("canEditWebsite", "/admin");
  const keys = [
    "site_name",
    "site_tagline",
    "contact_phone",
    "contact_email",
    "contact_whatsapp",
    "contact_address",
    "contact_timings",
    "home_hero_title",
    "home_hero_copy",
    "home_about_title",
    "home_about_copy"
  ];

  for (const key of keys) {
    const value = requireValue(formData, key);
    db.prepare(
      `INSERT INTO site_settings (setting_key, setting_value, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = datetime('now')`
    ).run(key, value);
  }

  refreshOperationalViews();
  redirect("/admin");
}
