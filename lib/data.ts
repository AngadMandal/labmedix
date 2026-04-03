import {
  AppointmentItem,
  AppRole,
  BillItem,
  DashboardMetric,
  DemoAccount,
  DoctorProfile,
  LabOrderItem,
  ReportItem,
  ServiceItem
} from "@/lib/types";

export const siteConfig = {
  name: "LabMedix",
  tagline: "Integrated OPD, diagnostics, reporting, and patient care in one professional digital system.",
  phone: "+91 89720 25390",
  email: "care@labmedix.in",
  whatsapp: "https://wa.me/918972025390",
  address: "Main Road, Agartala-ready single branch setup with OPD, diagnostics, and reporting desk",
  timings: "Mon-Sat, 8:00 AM to 8:00 PM"
};

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/doctors", label: "Doctors" },
  { href: "/services", label: "Tests & Services" },
  { href: "/book-appointment", label: "Book Appointment" },
  { href: "/book-test", label: "Book Lab Test" },
  { href: "/reports", label: "Reports" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" }
];

export const roleRoutes: Record<AppRole, string> = {
  admin: "/admin",
  patient: "/patient",
  doctor: "/doctor",
  lab: "/lab",
  operations: "/operations"
};

export const demoAccounts: DemoAccount[] = [
  { email: "admin@labmedix.in", label: "Super Admin", role: "admin", destination: "/admin" },
  { email: "editor@labmedix.in", label: "Website Editor", role: "admin", destination: "/admin" },
  { email: "patient@labmedix.in", label: "Patient", role: "patient", destination: "/patient" },
  { email: "doctor@labmedix.in", label: "Doctor", role: "doctor", destination: "/doctor" },
  { email: "lab@labmedix.in", label: "Lab Staff", role: "lab", destination: "/lab" },
  { email: "operations@labmedix.in", label: "Booking & Reporting", role: "operations", destination: "/operations" }
];

export const doctors: DoctorProfile[] = [
  {
    id: "dr-ashok-mandal",
    name: "Dr. Ashok Mandal",
    specialty: "General Physician",
    credentials: "M.B.B.S. Cal (WBMC), Ex-HP (Paediatrics & Chest)",
    experience: "15+ years",
    registration: "WBMC 92805",
    availability: "Mon, Wed, Fri | 10:00 AM - 2:00 PM",
    focusAreas: ["Paediatrics", "Chest", "Diabetes", "Hypertension", "Thyroid"]
  },
  {
    id: "dr-chinmay-mandal",
    name: "Dr. Chinmay Mandal",
    specialty: "General Medicine",
    credentials: "M.B.B.S. (Cal), (WBUHS), Ex-HP Cardiology Dept",
    experience: "8+ years",
    registration: "Active clinic registration",
    availability: "Tue, Thu, Sat | 11:00 AM - 4:00 PM",
    focusAreas: ["Cardiology support", "Adult medicine", "Routine consultations"]
  },
  {
    id: "dr-debabrata-mandal",
    name: "Dr. Debabrata Mandal",
    specialty: "Gastro & Liver Specialist",
    credentials: "M.B.B.S., Ex House Physician Gastroenterology, Critical Care RMO",
    experience: "10+ years",
    registration: "WBMC 98605",
    availability: "Mon to Sat | 2:30 PM - 6:30 PM",
    focusAreas: ["Gastroenterology", "Liver conditions", "Critical care follow-up"]
  },
  {
    id: "dr-biplob-mandal",
    name: "Dr. Biplob Mandal",
    specialty: "Gynaecology",
    credentials: "M.B.B.S., MS (Obstetrics & Gynaecology)",
    experience: "12+ years",
    registration: "WBMC 86511",
    availability: "Tue, Thu, Sun | 9:30 AM - 1:30 PM",
    focusAreas: ["Women's health", "Obstetrics", "Gynaecology consultations"]
  },
  {
    id: "dr-ismail-saikh",
    name: "Dr. Ismail Saikh",
    specialty: "Physiotherapy",
    credentials: "BPT (Kol)",
    experience: "7+ years",
    registration: "TNU-2020042100046",
    availability: "Daily | 8:00 AM - 12:00 PM",
    focusAreas: ["Low back pain", "Nerve pain", "Paralysis rehabilitation", "Chronic pain"]
  }
];

export const services: ServiceItem[] = [
  {
    id: "svc-opd-general",
    name: "General OPD Consultation",
    category: "OPD",
    price: 400,
    description: "Routine physician consultations, follow-up care, and chronic disease review."
  },
  {
    id: "svc-opd-gastro",
    name: "Gastro & Liver Consultation",
    category: "OPD",
    price: 700,
    description: "Specialized consultation for digestive and liver-related conditions."
  },
  {
    id: "svc-lab-cbc",
    name: "Complete Blood Count",
    category: "LAB",
    price: 350,
    turnaroundTime: "6 hours",
    description: "Routine hematology screening for infection, anemia, and overall health."
  },
  {
    id: "svc-lab-thyroid",
    name: "Thyroid Profile",
    category: "LAB",
    price: 850,
    turnaroundTime: "12 hours",
    description: "TSH, T3, and T4 profile for thyroid function monitoring."
  },
  {
    id: "svc-pack-diabetes",
    name: "Diabetes Monitoring Package",
    category: "PACKAGE",
    price: 1350,
    turnaroundTime: "24 hours",
    description: "Sugar profile, HbA1c, kidney function, and physician-ready summary."
  },
  {
    id: "svc-pack-wellness",
    name: "Preventive Wellness Package",
    category: "PACKAGE",
    price: 2499,
    turnaroundTime: "24 hours",
    description: "A bundled annual health package with pathology, sugar, lipid, and thyroid review."
  }
];

export const heroMetrics: DashboardMetric[] = [
  { label: "Patients Served", value: "12k+", note: "OPD and diagnostics combined" },
  { label: "Report Turnaround", value: "24 hrs", note: "For most routine lab profiles" },
  { label: "Specialist Clinics", value: "5", note: "Physician, gastro, gynaecology, and therapy support" },
  { label: "Digital Workflows", value: "100%", note: "Booking, billing, report access, and internal dashboards" }
];

export const adminMetrics: DashboardMetric[] = [
  { label: "Today's Appointments", value: "42", note: "9 awaiting confirmation" },
  { label: "Lab Orders", value: "31", note: "6 reports pending publication" },
  { label: "Revenue Today", value: "Rs. 38,450", note: "Across OPD and lab billing" },
  { label: "Active Doctors", value: "5", note: "All schedules synced for the week" }
];

export const patientMetrics: DashboardMetric[] = [
  { label: "Upcoming Visit", value: "08 Apr", note: "Dr. Debabrata Mandal at 3:30 PM" },
  { label: "Pending Dues", value: "Rs. 350", note: "One lab order awaiting payment" },
  { label: "Reports Available", value: "8", note: "Including latest thyroid profile" },
  { label: "Family Profiles", value: "3", note: "Ready for dependent management phase" }
];

export const doctorMetrics: DashboardMetric[] = [
  { label: "Today's Queue", value: "18", note: "4 follow-up consultations" },
  { label: "Completed", value: "11", note: "Average turnaround 14 minutes" },
  { label: "Pending Notes", value: "3", note: "Prescription files to upload" },
  { label: "Weekly Earnings", value: "Rs. 18,600", note: "Commission summary placeholder" }
];

export const labMetrics: DashboardMetric[] = [
  { label: "Samples Collected", value: "26", note: "Morning and afternoon batches" },
  { label: "In Process", value: "9", note: "Priority processing for 3 urgent profiles" },
  { label: "Reports Ready", value: "7", note: "Awaiting patient share or print" },
  { label: "Average TAT", value: "10 hrs", note: "Routine lab panels within SLA" }
];

export const operationsMetrics: DashboardMetric[] = [
  { label: "Bookings Today", value: "54", note: "OPD, walk-in, and online combined" },
  { label: "Reschedules", value: "6", note: "Mostly doctor timing adjustments" },
  { label: "Reports Published", value: "13", note: "Auto-shared to patient panel" },
  { label: "Counter Waiting", value: "5", note: "Patients awaiting billing or print" }
];

export const appointments: AppointmentItem[] = [
  {
    id: "APT-240401",
    patientName: "Rina Das",
    doctorName: "Dr. Ashok Mandal",
    department: "General OPD",
    time: "10:30 AM",
    status: "Confirmed",
    type: "OPD"
  },
  {
    id: "APT-240402",
    patientName: "Sanjib Roy",
    doctorName: "Dr. Debabrata Mandal",
    department: "Gastro Clinic",
    time: "1:00 PM",
    status: "Pending",
    type: "OPD"
  },
  {
    id: "APT-240403",
    patientName: "Lopa Saha",
    doctorName: "Dr. Biplob Mandal",
    department: "Gynaecology",
    time: "4:30 PM",
    status: "Completed",
    type: "Follow-up"
  }
];

export const labOrders: LabOrderItem[] = [
  {
    id: "LAB-240501",
    patientName: "Rina Das",
    testName: "Thyroid Profile",
    bookedAt: "09:10 AM",
    status: "Report Ready",
    reportReady: true
  },
  {
    id: "LAB-240502",
    patientName: "Rahul Deb",
    testName: "Complete Blood Count",
    bookedAt: "10:25 AM",
    status: "In Process",
    reportReady: false
  },
  {
    id: "LAB-240503",
    patientName: "Mita Chakraborty",
    testName: "Diabetes Monitoring Package",
    bookedAt: "11:40 AM",
    status: "Sample Collected",
    reportReady: false
  }
];

export const bills: BillItem[] = [
  { id: "BIL-1001", patientName: "Rina Das", category: "LAB", amount: 850, paymentStatus: "Paid", issuedAt: "2026-04-02" },
  { id: "BIL-1002", patientName: "Sanjib Roy", category: "OPD", amount: 700, paymentStatus: "Unpaid", issuedAt: "2026-04-03" },
  { id: "BIL-1003", patientName: "Rahul Deb", category: "LAB", amount: 350, paymentStatus: "Partial", issuedAt: "2026-04-03" }
];

export const reports: ReportItem[] = [
  {
    id: "REP-7001",
    patientName: "Rina Das",
    title: "Thyroid Profile Report",
    bookingId: "LAB-240501",
    publishedAt: "2026-04-03 02:30 PM",
    access: "Published"
  },
  {
    id: "REP-7002",
    patientName: "Anupam Pal",
    title: "CBC Report",
    bookingId: "LAB-240498",
    publishedAt: "2026-04-03 10:20 AM",
    access: "Internal"
  }
];

export const faqs = [
  {
    question: "Can patients book appointments without online payment?",
    answer: "Yes. The current LabMedix workflow supports book now, pay later so patients can reserve a slot and pay at the clinic."
  },
  {
    question: "How will reports be delivered?",
    answer: "Reports are published as secure PDFs and can be downloaded from the patient portal or shared by the reporting desk."
  },
  {
    question: "Can staff handle walk-in patients?",
    answer: "Yes. The booking and reporting panel includes walk-in entries, billing support, and report publishing flows."
  },
  {
    question: "Is the system ready for multiple branches?",
    answer: "The data model is multi-branch ready, while the first release is optimized for a single branch."
  }
];

export const highlights = [
  "Professional public website with conversion-focused booking paths",
  "Role-based dashboards for admin, patient, doctor, lab, and operations teams",
  "Digital OPD and diagnostics workflows aligned to your current billing and reporting sheets",
  "Report delivery, audit trail, and billing-ready data model for production expansion"
];
