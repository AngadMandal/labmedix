import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const dataDir = path.join(process.cwd(), "data");
const databasePath = path.join(dataDir, "labmedix.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new DatabaseSync(databasePath);

function seedIfEmpty() {
  const doctorCount = db.prepare("SELECT COUNT(*) AS count FROM doctors").get() as { count: number };
  const staffCount = db.prepare("SELECT COUNT(*) AS count FROM staff_users").get() as { count: number };
  const settingsCount = db.prepare("SELECT COUNT(*) AS count FROM site_settings").get() as { count: number };

  const insertStaff = db.prepare(`
    INSERT INTO staff_users (id, full_name, email, role_label, is_active, can_manage_staff, can_edit_website, can_manage_billing, can_manage_reports, can_manage_bookings, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  const insertSetting = db.prepare(`
    INSERT INTO site_settings (setting_key, setting_value, updated_at)
    VALUES (?, ?, datetime('now'))
    ON CONFLICT(setting_key) DO UPDATE SET setting_value = excluded.setting_value, updated_at = datetime('now')
  `);

  if (staffCount.count === 0) {
    insertStaff.run("staff-1", "Admin User", "admin@labmedix.in", "Super Admin", 1, 1, 1, 1, 1, 1);
    insertStaff.run("staff-2", "Front Desk Executive", "operations@labmedix.in", "Front Desk", 1, 0, 0, 1, 1, 1);
    insertStaff.run("staff-3", "Website Editor", "editor@labmedix.in", "Website Editor", 1, 0, 1, 0, 0, 0);
    insertStaff.run("staff-4", "Lab Manager", "lab@labmedix.in", "Lab Staff", 1, 0, 0, 0, 1, 1);
  }

  if (settingsCount.count === 0) {
    insertSetting.run("site_name", "LabMedix");
    insertSetting.run("site_tagline", "Integrated OPD, diagnostics, reporting, and patient care in one professional digital system.");
    insertSetting.run("contact_phone", "+91 89720 25390");
    insertSetting.run("contact_email", "care@labmedix.in");
    insertSetting.run("contact_whatsapp", "https://wa.me/918972025390");
    insertSetting.run("contact_address", "Main Road, Agartala-ready single branch setup with OPD, diagnostics, and reporting desk");
    insertSetting.run("contact_timings", "Mon-Sat, 8:00 AM to 8:00 PM");
    insertSetting.run("home_hero_title", "One digital front door for LabMedix clinics, diagnostics, and patient reporting.");
    insertSetting.run("home_hero_copy", "Build patient trust with a polished website while your staff runs OPD, diagnostics, billing, bookings, and reports from role-based dashboards in a single secure platform.");
    insertSetting.run("home_about_title", "Designed around the workflows your clinic already runs every day.");
    insertSetting.run("home_about_copy", "This MVP aligns with your OPD billing, lab billing, reports, user roles, dashboard, and doctor commission structure so the team can move from spreadsheets to a modern live system.");
  }

  if (doctorCount.count > 0) {
    return;
  }

  const insertDoctor = db.prepare(`
    INSERT INTO doctors (id, slug, full_name, specialty, registration_no, bio, availability, consultation_fee)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertService = db.prepare(`
    INSERT INTO services (id, slug, name, category, description, turnaround_time, price, is_package)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertPatient = db.prepare(`
    INSERT INTO patients (id, registration, full_name, phone, email, gender, address, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  const insertAppointment = db.prepare(`
    INSERT INTO appointments (id, booking_number, patient_id, doctor_id, appointment_date, status, visit_type, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  const insertLabOrder = db.prepare(`
    INSERT INTO lab_orders (id, booking_number, patient_id, service_id, status, sample_code, notes, booked_at, completed_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  const insertBill = db.prepare(`
    INSERT INTO bills (id, bill_number, patient_id, appointment_id, lab_order_id, amount, discount_amount, payment_status, issued_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
  const insertReport = db.prepare(`
    INSERT INTO reports (id, patient_id, lab_order_id, title, file_url, visibility, published_at, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const doctors = [
    ["doctor-1", "dr-ashok-mandal", "Dr. Ashok Mandal", "General Physician", "WBMC 92805", "M.B.B.S. Cal (WBMC), Ex-HP (Paediatrics & Chest).", "Mon, Wed, Fri | 10:00 AM - 2:00 PM", 400],
    ["doctor-2", "dr-chinmay-mandal", "Dr. Chinmay Mandal", "General Medicine", "Clinic registration active", "M.B.B.S. (Cal), (WBUHS), Ex-HP Cardiology Dept.", "Tue, Thu, Sat | 11:00 AM - 4:00 PM", 450],
    ["doctor-3", "dr-debabrata-mandal", "Dr. Debabrata Mandal", "Gastro & Liver Specialist", "WBMC 98605", "Ex House Physician Gastroenterology, Critical Care RMO.", "Mon to Sat | 2:30 PM - 6:30 PM", 700],
    ["doctor-4", "dr-biplob-mandal", "Dr. Biplob Mandal", "Gynaecology", "WBMC 86511", "M.B.B.S., MS (Obstetrics & Gynaecology).", "Tue, Thu, Sun | 9:30 AM - 1:30 PM", 650],
    ["doctor-5", "dr-ismail-saikh", "Dr. Ismail Saikh", "Physiotherapy", "TNU-2020042100046", "BPT (Kol), chronic pain and rehabilitation support.", "Daily | 8:00 AM - 12:00 PM", 500]
  ] as const;

  const services = [
    ["service-1", "general-opd-consultation", "General OPD Consultation", "OPD", "Routine physician consultations, follow-up care, and chronic disease review.", null, 400, 0],
    ["service-2", "gastro-liver-consultation", "Gastro & Liver Consultation", "OPD", "Specialized consultation for digestive and liver-related conditions.", null, 700, 0],
    ["service-3", "complete-blood-count", "Complete Blood Count", "LAB", "Routine hematology screening for infection, anemia, and overall health.", "6 hours", 350, 0],
    ["service-4", "thyroid-profile", "Thyroid Profile", "LAB", "TSH, T3, and T4 profile for thyroid function monitoring.", "12 hours", 850, 0],
    ["service-5", "diabetes-monitoring-package", "Diabetes Monitoring Package", "PACKAGE", "Sugar profile, HbA1c, kidney function, and physician-ready summary.", "24 hours", 1350, 1],
    ["service-6", "preventive-wellness-package", "Preventive Wellness Package", "PACKAGE", "A bundled annual health package with pathology, sugar, lipid, and thyroid review.", "24 hours", 2499, 1]
  ] as const;

  const patients = [
    ["patient-1", "PAT-1001", "Rina Das", "9000000001", "rina@example.com", "Female", ""],
    ["patient-2", "PAT-1002", "Sanjib Roy", "9000000002", "sanjib@example.com", "Male", ""],
    ["patient-3", "PAT-1003", "Rahul Deb", "9000000003", "rahul@example.com", "Male", ""]
  ] as const;

  db.exec("BEGIN");
  try {
    doctors.forEach((doctor) => insertDoctor.run(...doctor));
    services.forEach((service) => insertService.run(...service));
    patients.forEach((patient) => insertPatient.run(...patient));

    insertAppointment.run("appt-1", "APT-240401", "patient-1", "doctor-1", "2026-04-04T10:30:00+05:30", "CONFIRMED", "OPD", "Routine physician review");
    insertAppointment.run("appt-2", "APT-240402", "patient-2", "doctor-3", "2026-04-04T13:00:00+05:30", "PENDING", "OPD", "Stomach pain follow-up");

    insertLabOrder.run("lab-1", "LAB-240501", "patient-1", "service-4", "REPORT_READY", "SMP-001", "Priority thyroid follow-up", "2026-04-03T09:10:00+05:30", "2026-04-03T14:15:00+05:30");
    insertLabOrder.run("lab-2", "LAB-240502", "patient-3", "service-3", "IN_PROCESS", "SMP-002", "", "2026-04-03T10:25:00+05:30", null);

    insertBill.run("bill-1", "BIL-1001", "patient-1", "appt-1", null, 400, 0, "PAID", "2026-04-02T10:00:00+05:30");
    insertBill.run("bill-2", "BIL-1002", "patient-2", "appt-2", null, 700, 0, "UNPAID", "2026-04-03T10:00:00+05:30");
    insertBill.run("bill-3", "BIL-1003", "patient-1", null, "lab-1", 850, 0, "PAID", "2026-04-03T11:00:00+05:30");
    insertBill.run("bill-4", "BIL-1004", "patient-3", null, "lab-2", 350, 0, "PARTIAL", "2026-04-03T11:15:00+05:30");

    insertReport.run("report-1", "patient-1", "lab-1", "Thyroid Profile Report", "/reports/sample-thyroid-profile.pdf", "PUBLISHED", "2026-04-03T14:30:00+05:30");
    insertReport.run("report-2", "patient-3", "lab-2", "CBC Report", "/reports/sample-cbc-report.pdf", "INTERNAL", null);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

db.exec(`
  CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    registration_no TEXT,
    bio TEXT,
    availability TEXT,
    consultation_fee INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    turnaround_time TEXT,
    price INTEGER NOT NULL,
    is_package INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    registration TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    gender TEXT,
    address TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    booking_number TEXT NOT NULL UNIQUE,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    status TEXT NOT NULL,
    visit_type TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lab_orders (
    id TEXT PRIMARY KEY,
    booking_number TEXT NOT NULL UNIQUE,
    patient_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    status TEXT NOT NULL,
    sample_code TEXT,
    notes TEXT,
    booked_at TEXT NOT NULL,
    completed_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bills (
    id TEXT PRIMARY KEY,
    bill_number TEXT NOT NULL UNIQUE,
    patient_id TEXT NOT NULL,
    appointment_id TEXT UNIQUE,
    lab_order_id TEXT UNIQUE,
    amount INTEGER NOT NULL,
    discount_amount INTEGER NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    lab_order_id TEXT,
    title TEXT NOT NULL,
    file_url TEXT NOT NULL,
    visibility TEXT NOT NULL,
    published_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS staff_users (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role_label TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    can_manage_staff INTEGER NOT NULL DEFAULT 0,
    can_edit_website INTEGER NOT NULL DEFAULT 0,
    can_manage_billing INTEGER NOT NULL DEFAULT 0,
    can_manage_reports INTEGER NOT NULL DEFAULT 0,
    can_manage_bookings INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

seedIfEmpty();

export function getDatabase() {
  return db;
}
