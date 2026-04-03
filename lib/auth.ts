import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDatabase } from "@/lib/database";
import { roleRoutes } from "@/lib/data";
import { AppRole } from "@/lib/types";

const db = getDatabase();

export type SessionUser = {
  email: string;
  role: AppRole;
  displayName: string;
  roleLabel: string;
  permissions: {
    canManageStaff: boolean;
    canEditWebsite: boolean;
    canManageBilling: boolean;
    canManageReports: boolean;
    canManageBookings: boolean;
  };
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get("labmedix-email")?.value;
  const role = cookieStore.get("labmedix-role")?.value as AppRole | undefined;

  if (!email || !role) {
    return null;
  }

  const staff = db
    .prepare(
      `SELECT full_name AS fullName, role_label AS roleLabel, can_manage_staff AS canManageStaff,
              can_edit_website AS canEditWebsite, can_manage_billing AS canManageBilling,
              can_manage_reports AS canManageReports, can_manage_bookings AS canManageBookings
       FROM staff_users
       WHERE lower(email) = lower(?) AND is_active = 1`
    )
    .get(email) as
    | {
        fullName: string;
        roleLabel: string;
        canManageStaff: number;
        canEditWebsite: number;
        canManageBilling: number;
        canManageReports: number;
        canManageBookings: number;
      }
    | undefined;

  if (staff) {
    return {
      email,
      role,
      displayName: staff.fullName,
      roleLabel: staff.roleLabel,
      permissions: {
        canManageStaff: staff.canManageStaff === 1,
        canEditWebsite: staff.canEditWebsite === 1,
        canManageBilling: staff.canManageBilling === 1,
        canManageReports: staff.canManageReports === 1,
        canManageBookings: staff.canManageBookings === 1
      }
    };
  }

  if (role === "admin") {
    return {
      email,
      role,
      displayName: "Admin User",
      roleLabel: "Super Admin",
      permissions: {
        canManageStaff: true,
        canEditWebsite: true,
        canManageBilling: true,
        canManageReports: true,
        canManageBookings: true
      }
    };
  }

  return {
    email,
    role,
    displayName: email,
    roleLabel: role,
    permissions: {
      canManageStaff: false,
      canEditWebsite: false,
      canManageBilling: role === "operations",
      canManageReports: role === "lab" || role === "operations",
      canManageBookings: role === "operations" || role === "lab"
    }
  };
}

export async function requireSession(role?: AppRole) {
  const session = await getSessionUser();

  if (!session) {
    const target = role ? roleRoutes[role] : "/admin";
    redirect(`/login?redirect=${encodeURIComponent(target)}`);
  }

  if (role && session.role !== role) {
    redirect(roleRoutes[session.role]);
  }

  return session;
}

export async function requirePermission(permission: keyof SessionUser["permissions"], fallback = "/admin") {
  const session = await requireSession();

  if (!session.permissions[permission]) {
    redirect(`${fallback}?notice=${encodeURIComponent("You do not have permission for that action.")}`);
  }

  return session;
}
