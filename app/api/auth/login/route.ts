import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getDatabase } from "@/lib/database";
import { demoAccounts, roleRoutes } from "@/lib/data";
import { AppRole } from "@/lib/types";

const db = getDatabase();

function resolveRoleByEmail(email: string): AppRole | null {
  const matched = demoAccounts.find((account) => account.email === email);

  if (matched) {
    return matched.role;
  }

  const staff = db
    .prepare(
      `SELECT role_label AS roleLabel, can_manage_staff AS canManageStaff, can_edit_website AS canEditWebsite,
              can_manage_reports AS canManageReports, can_manage_bookings AS canManageBookings, can_manage_billing AS canManageBilling
       FROM staff_users
       WHERE lower(email) = lower(?) AND is_active = 1`
    )
    .get(email) as
    | {
        roleLabel: string;
        canManageStaff: number;
        canEditWebsite: number;
        canManageReports: number;
        canManageBookings: number;
        canManageBilling: number;
      }
    | undefined;

  if (!staff) {
    return null;
  }

  if (staff.canManageStaff || staff.canEditWebsite) {
    return "admin";
  }

  if (staff.canManageReports || staff.canManageBookings || staff.canManageBilling) {
    return "operations";
  }

  return "patient";
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").toLowerCase();
  const redirect = String(formData.get("redirect") ?? "");
  const resolvedRole = resolveRoleByEmail(email);

  if (!resolvedRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const cookieStore = await cookies();
  cookieStore.set("labmedix-role", resolvedRole, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });
  cookieStore.set("labmedix-email", email, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });

  const destination = redirect && redirect.startsWith("/") ? redirect : roleRoutes[resolvedRole];

  return NextResponse.redirect(new URL(destination, request.url));
}
