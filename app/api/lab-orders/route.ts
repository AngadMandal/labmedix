import { NextResponse } from "next/server";

import { getLabOrders } from "@/lib/db";

export async function GET() {
  return NextResponse.json({ data: await getLabOrders() });
}
