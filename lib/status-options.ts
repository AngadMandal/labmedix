export const APPOINTMENT_STATUSES = ["PENDING", "CONFIRMED", "RESCHEDULED", "COMPLETED", "CANCELLED"] as const;
export const LAB_ORDER_STATUSES = ["BOOKED", "SAMPLE_COLLECTED", "IN_PROCESS", "COMPLETED", "REPORT_READY", "DELIVERED"] as const;
export const PAYMENT_STATUSES = ["UNPAID", "PARTIAL", "PAID"] as const;
export const REPORT_VISIBILITIES = ["INTERNAL", "PUBLISHED"] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];
export type LabOrderStatus = (typeof LAB_ORDER_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type ReportVisibility = (typeof REPORT_VISIBILITIES)[number];
