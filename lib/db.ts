import { getDatabase } from "@/lib/database";
import {
  AppointmentStatus,
  LabOrderStatus,
  PaymentStatus,
  ReportVisibility
} from "@/lib/status-options";
import { DashboardMetric } from "@/lib/types";

const db = getDatabase();

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export async function getDoctors() {
  return db
    .prepare(
      `SELECT id, slug, full_name AS fullName, specialty, registration_no AS registrationNo, bio, availability, consultation_fee AS consultationFee
       FROM doctors
       ORDER BY full_name`
    )
    .all() as Array<{
      id: string;
      slug: string;
      fullName: string;
      specialty: string;
      registrationNo: string | null;
      bio: string | null;
      availability: string | null;
      consultationFee: number | null;
    }>;
}

export async function getServices() {
  return db
    .prepare(
      `SELECT id, slug, name, category, description, turnaround_time AS turnaroundTime, price, is_package AS isPackage
       FROM services
       ORDER BY category, name`
    )
    .all() as Array<{
      id: string;
      slug: string;
      name: string;
      category: string;
      description: string;
      turnaroundTime: string | null;
      price: number;
      isPackage: number;
    }>;
}

export async function getAppointments() {
  const rows = db
    .prepare(
      `SELECT a.id AS recordId, a.booking_number AS id, p.full_name AS patientName, p.phone AS patientPhone,
              d.full_name AS doctorName, d.specialty AS department, a.appointment_date AS appointmentDate,
              a.status AS status, a.visit_type AS type
       FROM appointments a
       JOIN patients p ON p.id = a.patient_id
       JOIN doctors d ON d.id = a.doctor_id
       ORDER BY a.appointment_date ASC`
    )
    .all() as Array<Record<string, string>>;

  return rows.map((item) => ({
    ...item,
    status: item.status as AppointmentStatus,
    time: formatTime(item.appointmentDate),
    date: new Date(item.appointmentDate)
  }));
}

export async function getLabOrders() {
  const rows = db
    .prepare(
      `SELECT lo.id AS recordId, lo.booking_number AS id, p.full_name AS patientName, p.phone AS patientPhone,
              s.name AS testName, lo.booked_at AS bookedAtRaw, lo.status AS status,
              EXISTS(SELECT 1 FROM reports r WHERE r.lab_order_id = lo.id AND r.visibility = 'PUBLISHED') AS reportReady
       FROM lab_orders lo
       JOIN patients p ON p.id = lo.patient_id
       JOIN services s ON s.id = lo.service_id
       ORDER BY lo.booked_at DESC`
    )
    .all() as Array<Record<string, string | number>>;

  return rows.map((item) => ({
    recordId: String(item.recordId),
    id: String(item.id),
    patientName: String(item.patientName),
    patientPhone: String(item.patientPhone),
    testName: String(item.testName),
    bookedAt: formatDateTime(String(item.bookedAtRaw)),
    status: String(item.status) as LabOrderStatus,
    reportReady: Number(item.reportReady) === 1
  }));
}

export async function getBills() {
  const rows = db
    .prepare(
      `SELECT b.id AS recordId, b.bill_number AS id, p.full_name AS patientName, b.amount, b.payment_status AS paymentStatus,
              b.issued_at AS issuedAtRaw, CASE WHEN b.appointment_id IS NOT NULL THEN 'OPD' ELSE 'LAB' END AS category
       FROM bills b
       JOIN patients p ON p.id = b.patient_id
       ORDER BY b.issued_at DESC`
    )
    .all() as Array<Record<string, string | number>>;

  return rows.map((item) => ({
    recordId: String(item.recordId),
    id: String(item.id),
    patientName: String(item.patientName),
    category: String(item.category),
    amount: Number(item.amount),
    paymentStatus: String(item.paymentStatus) as PaymentStatus,
    issuedAt: formatDateTime(String(item.issuedAtRaw))
  }));
}

export async function getReports() {
  const rows = db
    .prepare(
      `SELECT r.id, p.full_name AS patientName, r.title, COALESCE(lo.booking_number, 'Walk-in') AS bookingId,
              r.published_at AS publishedAtRaw, r.visibility AS access, r.file_url AS fileUrl
       FROM reports r
       JOIN patients p ON p.id = r.patient_id
       LEFT JOIN lab_orders lo ON lo.id = r.lab_order_id
       ORDER BY r.created_at DESC`
    )
    .all() as Array<Record<string, string | null>>;

  return rows.map((item) => ({
    id: String(item.id),
    patientName: String(item.patientName),
    title: String(item.title),
    bookingId: String(item.bookingId),
    publishedAt: item.publishedAtRaw ? formatDateTime(String(item.publishedAtRaw)) : "Not published yet",
    access: String(item.access) as ReportVisibility,
    fileUrl: String(item.fileUrl)
  }));
}

const defaultSiteContent = {
  site_name: "LabMedix",
  site_tagline: "Integrated OPD, diagnostics, reporting, and patient care in one professional digital system.",
  contact_phone: "+91 89720 25390",
  contact_email: "care@labmedix.in",
  contact_whatsapp: "https://wa.me/918972025390",
  contact_address: "Main Road, Agartala-ready single branch setup with OPD, diagnostics, and reporting desk",
  contact_timings: "Mon-Sat, 8:00 AM to 8:00 PM",
  home_hero_title: "One digital front door for LabMedix clinics, diagnostics, and patient reporting.",
  home_hero_copy:
    "Build patient trust with a polished website while your staff runs OPD, diagnostics, billing, bookings, and reports from role-based dashboards in a single secure platform.",
  home_about_title: "Designed around the workflows your clinic already runs every day.",
  home_about_copy:
    "This MVP aligns with your OPD billing, lab billing, reports, user roles, dashboard, and doctor commission structure so the team can move from spreadsheets to a modern live system."
};

export async function getSiteContent() {
  const rows = db
    .prepare("SELECT setting_key AS settingKey, setting_value AS settingValue FROM site_settings")
    .all() as Array<{ settingKey: string; settingValue: string }>;

  const dynamic = Object.fromEntries(rows.map((row) => [row.settingKey, row.settingValue]));

  return {
    ...defaultSiteContent,
    ...dynamic
  };
}

export async function getStaffUsers() {
  return db
    .prepare(
      `SELECT id, full_name AS fullName, email, role_label AS roleLabel, is_active AS isActive,
              can_manage_staff AS canManageStaff, can_edit_website AS canEditWebsite,
              can_manage_billing AS canManageBilling, can_manage_reports AS canManageReports,
              can_manage_bookings AS canManageBookings
       FROM staff_users
       ORDER BY full_name`
    )
    .all() as Array<{
      id: string;
      fullName: string;
      email: string;
      roleLabel: string;
      isActive: number;
      canManageStaff: number;
      canEditWebsite: number;
      canManageBilling: number;
      canManageReports: number;
      canManageBookings: number;
    }>;
}

function count(query: string, ...params: Array<string | number>) {
  return Number((db.prepare(query).get(...params) as { count: number }).count);
}

function sum(query: string, ...params: Array<string | number>) {
  return Number((db.prepare(query).get(...params) as { total: number | null }).total ?? 0);
}

export async function getAdminMetrics(): Promise<DashboardMetric[]> {
  return [
    { label: "Today's Appointments", value: String(count("SELECT COUNT(*) AS count FROM appointments")), note: `${count("SELECT COUNT(*) AS count FROM appointments WHERE status = 'PENDING'")} awaiting confirmation` },
    { label: "Lab Orders", value: String(count("SELECT COUNT(*) AS count FROM lab_orders")), note: `${count("SELECT COUNT(*) AS count FROM reports WHERE visibility = 'INTERNAL'")} reports pending publication` },
    { label: "Revenue Collected", value: `Rs. ${sum("SELECT SUM(amount) AS total FROM bills WHERE payment_status = 'PAID'")}`, note: "Paid OPD and lab bills" },
    { label: "Active Doctors", value: String(count("SELECT COUNT(*) AS count FROM doctors")), note: "Doctor schedules loaded from the database" }
  ];
}

export async function getPatientMetrics(): Promise<DashboardMetric[]> {
  const nextAppointment = db
    .prepare(
      `SELECT a.appointment_date AS appointmentDate, d.full_name AS doctorName
       FROM appointments a
       JOIN doctors d ON d.id = a.doctor_id
       WHERE a.status IN ('PENDING', 'CONFIRMED', 'RESCHEDULED')
       ORDER BY a.appointment_date ASC
       LIMIT 1`
    )
    .get() as { appointmentDate?: string; doctorName?: string };

  return [
    {
      label: "Upcoming Visit",
      value: nextAppointment.appointmentDate ? formatDateTime(nextAppointment.appointmentDate) : "No booking",
      note: nextAppointment.doctorName ?? "Book a consultation"
    },
    {
      label: "Pending Dues",
      value: `Rs. ${sum("SELECT SUM(amount) AS total FROM bills WHERE payment_status IN ('UNPAID', 'PARTIAL')")}`,
      note: "Outstanding OPD or lab bill"
    },
    { label: "Reports Available", value: String(count("SELECT COUNT(*) AS count FROM reports WHERE visibility = 'PUBLISHED'")), note: "Published report PDFs" },
    { label: "Registered Patients", value: String(count("SELECT COUNT(*) AS count FROM patients")), note: "Live patient records in the database" }
  ];
}

export async function getDoctorMetrics(): Promise<DashboardMetric[]> {
  return [
    { label: "Today's Queue", value: String(count("SELECT COUNT(*) AS count FROM appointments WHERE status IN ('PENDING', 'CONFIRMED')")), note: "Pending and confirmed consultations" },
    { label: "Completed", value: String(count("SELECT COUNT(*) AS count FROM appointments WHERE status = 'COMPLETED'")), note: "Completed consultations" },
    { label: "Rescheduled", value: String(count("SELECT COUNT(*) AS count FROM appointments WHERE status = 'RESCHEDULED'")), note: "Appointments moved to another slot" },
    { label: "Consultation Revenue", value: `Rs. ${sum("SELECT SUM(amount) AS total FROM bills WHERE appointment_id IS NOT NULL AND payment_status = 'PAID'")}`, note: "Paid OPD billing total" }
  ];
}

export async function getLabMetrics(): Promise<DashboardMetric[]> {
  const tat = db
    .prepare("SELECT turnaround_time AS turnaroundTime FROM services WHERE turnaround_time IS NOT NULL LIMIT 1")
    .get() as { turnaroundTime?: string };

  return [
    { label: "Samples Collected", value: String(count("SELECT COUNT(*) AS count FROM lab_orders WHERE status = 'SAMPLE_COLLECTED'")), note: "Collected and waiting for processing" },
    { label: "In Process", value: String(count("SELECT COUNT(*) AS count FROM lab_orders WHERE status = 'IN_PROCESS'")), note: "Active lab workload" },
    { label: "Reports Ready", value: String(count("SELECT COUNT(*) AS count FROM lab_orders WHERE status IN ('REPORT_READY', 'DELIVERED')")), note: "Ready for publication or delivery" },
    { label: "Average TAT", value: tat.turnaroundTime ?? "24 hours", note: "Configured by service catalog" }
  ];
}

export async function getOperationsMetrics(): Promise<DashboardMetric[]> {
  return [
    { label: "Bookings Today", value: String(count("SELECT COUNT(*) AS count FROM appointments")), note: "Appointments and lab intake available" },
    { label: "Reschedules", value: String(count("SELECT COUNT(*) AS count FROM appointments WHERE status = 'RESCHEDULED'")), note: "Appointments moved after booking" },
    { label: "Reports Published", value: String(count("SELECT COUNT(*) AS count FROM reports WHERE visibility = 'PUBLISHED'")), note: "Shared to patient/report view" },
    { label: "Counter Waiting", value: String(count("SELECT COUNT(*) AS count FROM bills WHERE payment_status IN ('UNPAID', 'PARTIAL')")), note: "Bills needing payment attention" }
  ];
}
