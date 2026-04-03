import Link from "next/link";
import { ReactNode } from "react";

import { roleRoutes, siteConfig } from "@/lib/data";
import { AppRole } from "@/lib/types";

type DashboardShellProps = {
  role: AppRole;
  title: string;
  subtitle: string;
  children: ReactNode;
};

const roleLabels: Record<AppRole, string> = {
  admin: "Admin Panel",
  patient: "Patient Panel",
  doctor: "Doctor Panel",
  lab: "Lab Panel",
  operations: "Booking & Reporting Panel"
};

export function DashboardShell({ role, title, subtitle, children }: DashboardShellProps) {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div>
          <p className="eyebrow">LabMedix</p>
          <h2>{roleLabels[role]}</h2>
          <p>{siteConfig.tagline}</p>
        </div>
        <nav className="dashboard-nav">
          {Object.entries(roleRoutes).map(([roleKey, route]) => (
            <Link key={route} href={route} className={roleKey === role ? "active" : undefined}>
              {roleLabels[roleKey as AppRole]}
            </Link>
          ))}
        </nav>
        <Link href="/api/auth/logout" className="ghost-button">
          Logout
        </Link>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <p className="eyebrow">{roleLabels[role]}</p>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <Link href="/" className="ghost-button">
            View Website
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}
