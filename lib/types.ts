export type AppRole = "admin" | "patient" | "doctor" | "lab" | "operations";

export type DoctorProfile = {
  id: string;
  name: string;
  specialty: string;
  credentials: string;
  experience: string;
  registration: string;
  availability: string;
  focusAreas: string[];
};

export type ServiceItem = {
  id: string;
  name: string;
  category: "OPD" | "LAB" | "PACKAGE";
  price: number;
  turnaroundTime?: string;
  description: string;
};

export type AppointmentItem = {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  time: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  type: "OPD" | "Follow-up";
};

export type LabOrderItem = {
  id: string;
  patientName: string;
  testName: string;
  bookedAt: string;
  status:
    | "Booked"
    | "Sample Collected"
    | "In Process"
    | "Completed"
    | "Report Ready"
    | "Delivered";
  reportReady: boolean;
};

export type BillItem = {
  id: string;
  patientName: string;
  category: "OPD" | "LAB";
  amount: number;
  paymentStatus: "Unpaid" | "Partial" | "Paid";
  issuedAt: string;
};

export type ReportItem = {
  id: string;
  patientName: string;
  title: string;
  bookingId: string;
  publishedAt: string;
  access: "Internal" | "Published";
};

export type DashboardMetric = {
  label: string;
  value: string;
  note: string;
};

export type DemoAccount = {
  email: string;
  label: string;
  role: AppRole;
  destination: string;
};
