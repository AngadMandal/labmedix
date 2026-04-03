import { NextResponse } from "next/server";

import { getAdminMetrics, getDoctorMetrics, getLabMetrics, getOperationsMetrics, getPatientMetrics } from "@/lib/db";

export async function GET() {
  const [admin, patient, doctor, lab, operations] = await Promise.all([
    getAdminMetrics(),
    getPatientMetrics(),
    getDoctorMetrics(),
    getLabMetrics(),
    getOperationsMetrics()
  ]);

  return NextResponse.json({
    admin,
    patient,
    doctor,
    lab,
    operations
  });
}
