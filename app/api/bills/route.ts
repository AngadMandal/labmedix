import { NextResponse } from "next/server";

import { getBills } from "@/lib/db";

export async function GET() {
  return NextResponse.json({ data: await getBills() });
}
