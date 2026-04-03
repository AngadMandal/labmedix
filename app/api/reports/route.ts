import { NextResponse } from "next/server";

import { getReports } from "@/lib/db";

export async function GET() {
  return NextResponse.json({ data: await getReports() });
}
