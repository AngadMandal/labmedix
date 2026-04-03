import {
  createStaffUserAction,
  updateAppointmentStatusAction,
  updateBillPaymentAction,
  updateSiteSettingsAction,
  updateStaffPermissionsAction
} from "@/app/actions";
import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { SubmitButton } from "@/components/submit-button";
import { requireSession } from "@/lib/auth";
import { getAdminMetrics, getAppointments, getBills, getDoctors, getLabOrders, getSiteContent, getStaffUsers } from "@/lib/db";
import { APPOINTMENT_STATUSES, PAYMENT_STATUSES } from "@/lib/status-options";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireSession("admin");
  const [adminMetrics, appointments, bills, doctors, labOrders, staffUsers, siteContent] = await Promise.all([
    getAdminMetrics(),
    getAppointments(),
    getBills(),
    getDoctors(),
    getLabOrders(),
    getStaffUsers(),
    getSiteContent()
  ]);

  return (
    <DashboardShell
      role="admin"
      title="Control the entire OPD and diagnostics operation"
      subtitle={`${session.displayName} can access only the modules allowed by the current permission profile.`}
    >
      <section className="dashboard-grid">
        {adminMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="panel-grid">
        <div>
          <DataTable
            title="Today's Appointment Queue"
            columns={["Booking ID", "Patient", "Doctor", "Department", "Time", "Status"]}
            rows={appointments.map((item) => [
              item.id,
              item.patientName,
              item.doctorName,
              item.department,
              item.time,
              <div key={item.id}>
                <StatusBadge tone={item.status === "COMPLETED" ? "success" : item.status === "PENDING" ? "warning" : "default"}>
                  {item.status}
                </StatusBadge>
                {session.permissions.canManageBookings ? (
                  <form action={updateAppointmentStatusAction} style={{ marginTop: 8 }}>
                    <input type="hidden" name="appointmentId" value={item.recordId} />
                    <input type="hidden" name="redirectTo" value="/admin" />
                    <select name="status" defaultValue={item.status}>
                      {APPOINTMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <SubmitButton className="ghost-button" pendingLabel="Updating...">
                      Save
                    </SubmitButton>
                  </form>
                ) : null}
              </div>
            ])}
          />
          {session.permissions.canManageBilling ? (
            <DataTable
              title="Recent Billing"
              columns={["Bill ID", "Patient", "Category", "Amount", "Payment", "Issued"]}
              rows={bills.map((bill) => [
                bill.id,
                bill.patientName,
                bill.category,
                formatCurrency(bill.amount),
                <div key={bill.id}>
                  <StatusBadge tone={bill.paymentStatus === "PAID" ? "success" : bill.paymentStatus === "PARTIAL" ? "warning" : "default"}>
                    {bill.paymentStatus}
                  </StatusBadge>
                  <form action={updateBillPaymentAction} style={{ marginTop: 8 }}>
                    <input type="hidden" name="billId" value={bill.recordId} />
                    <input type="hidden" name="redirectTo" value="/admin" />
                    <select name="paymentStatus" defaultValue={bill.paymentStatus}>
                      {PAYMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <SubmitButton className="ghost-button" pendingLabel="Saving...">
                      Save
                    </SubmitButton>
                  </form>
                </div>,
                bill.issuedAt
              ])}
            />
          ) : null}
        </div>
        <div className="stats-grid">
          <article className="panel-card">
            <p className="eyebrow">Doctor Management</p>
            <h3>{doctors.length} active specialists</h3>
            <p>Schedules, credentials, specialties, and consultation categories are all structured for CMS and booking sync.</p>
          </article>
          <article className="panel-card">
            <p className="eyebrow">Lab Oversight</p>
            <h3>{labOrders.length} live orders</h3>
            <p>Monitor pending collection, in-process work, report readiness, and publication handoff to operations.</p>
          </article>
          <article className="panel-card">
            <p className="eyebrow">Exports</p>
            <h3>Day-wise and doctor-wise reporting</h3>
            <p>Prepared to replace manual summary sheets with structured exports and dashboard analytics.</p>
          </article>
          <article className="panel-card">
            <p className="eyebrow">CMS Ready</p>
            <h3>Website content hooks</h3>
            <p>Doctor cards, services, banners, FAQs, and contact information can be controlled from admin in the next phase.</p>
          </article>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ width: "100%" }}>
          <div className="section-heading">
            <p className="eyebrow">Admin Permissions</p>
            <h2>All-permission staff control and website editor access</h2>
            <p>Manage staff access, assign editor rights, and update the public website content directly from admin.</p>
          </div>
          <div className="content-grid">
            {session.permissions.canManageStaff ? (
              <article className="form-card">
              <p className="eyebrow">Staff Permissions</p>
              <h3>Update staff roles and access</h3>
              <div className="stats-grid">
                {staffUsers.map((staff) => (
                  <form key={staff.id} action={updateStaffPermissionsAction} className="panel-card">
                    <input type="hidden" name="staffId" value={staff.id} />
                    <p className="eyebrow">{staff.roleLabel}</p>
                    <h3>{staff.fullName}</h3>
                    <p>{staff.email}</p>
                    <label className="field">
                      Role Label
                      <input name="roleLabel" type="text" defaultValue={staff.roleLabel} required />
                    </label>
                    <label className="field">
                      <input name="isActive" type="checkbox" defaultChecked={staff.isActive === 1} />
                      Active Staff
                    </label>
                    <label className="field">
                      <input name="canManageStaff" type="checkbox" defaultChecked={staff.canManageStaff === 1} />
                      Manage Staff
                    </label>
                    <label className="field">
                      <input name="canEditWebsite" type="checkbox" defaultChecked={staff.canEditWebsite === 1} />
                      Website Editor
                    </label>
                    <label className="field">
                      <input name="canManageBilling" type="checkbox" defaultChecked={staff.canManageBilling === 1} />
                      Billing Access
                    </label>
                    <label className="field">
                      <input name="canManageReports" type="checkbox" defaultChecked={staff.canManageReports === 1} />
                      Report Access
                    </label>
                    <label className="field">
                      <input name="canManageBookings" type="checkbox" defaultChecked={staff.canManageBookings === 1} />
                      Booking Access
                    </label>
                    <SubmitButton pendingLabel="Updating...">Update Permission</SubmitButton>
                  </form>
                ))}
              </div>
            </article>
            ) : null}
            {session.permissions.canManageStaff ? (
              <article className="form-card">
              <p className="eyebrow">Create Staff</p>
              <h3>Add new staff permission profile</h3>
              <form action={createStaffUserAction} className="form-grid">
                <label className="field">
                  Full Name
                  <input name="fullName" type="text" required />
                </label>
                <label className="field">
                  Email
                  <input name="email" type="email" required />
                </label>
                <label className="field full">
                  Role Label
                  <input name="roleLabel" type="text" placeholder="Website Editor / Front Desk / Billing Manager" required />
                </label>
                <label className="field">
                  <input name="canManageStaff" type="checkbox" />
                  Manage Staff
                </label>
                <label className="field">
                  <input name="canEditWebsite" type="checkbox" />
                  Website Editor
                </label>
                <label className="field">
                  <input name="canManageBilling" type="checkbox" />
                  Billing Access
                </label>
                <label className="field">
                  <input name="canManageReports" type="checkbox" />
                  Report Access
                </label>
                <label className="field full">
                  <input name="canManageBookings" type="checkbox" />
                  Booking Access
                </label>
                <div className="field full">
                  <SubmitButton pendingLabel="Creating...">Create Staff Permission</SubmitButton>
                </div>
              </form>
            </article>
            ) : null}
          </div>
          {session.permissions.canEditWebsite ? (
            <article className="form-card" style={{ marginTop: 24 }}>
            <p className="eyebrow">Website Edit</p>
            <h3>Update public website content from admin</h3>
            <form action={updateSiteSettingsAction} className="form-grid">
              <label className="field">
                Site Name
                <input name="site_name" type="text" defaultValue={siteContent.site_name} required />
              </label>
              <label className="field">
                Site Tagline
                <input name="site_tagline" type="text" defaultValue={siteContent.site_tagline} required />
              </label>
              <label className="field">
                Phone
                <input name="contact_phone" type="text" defaultValue={siteContent.contact_phone} required />
              </label>
              <label className="field">
                Email
                <input name="contact_email" type="email" defaultValue={siteContent.contact_email} required />
              </label>
              <label className="field">
                WhatsApp Link
                <input name="contact_whatsapp" type="text" defaultValue={siteContent.contact_whatsapp} required />
              </label>
              <label className="field">
                Timings
                <input name="contact_timings" type="text" defaultValue={siteContent.contact_timings} required />
              </label>
              <label className="field full">
                Address
                <textarea name="contact_address" defaultValue={siteContent.contact_address} required />
              </label>
              <label className="field full">
                Home Hero Title
                <textarea name="home_hero_title" defaultValue={siteContent.home_hero_title} required />
              </label>
              <label className="field full">
                Home Hero Copy
                <textarea name="home_hero_copy" defaultValue={siteContent.home_hero_copy} required />
              </label>
              <label className="field">
                About Section Title
                <input name="home_about_title" type="text" defaultValue={siteContent.home_about_title} required />
              </label>
              <label className="field">
                About Section Copy
                <input name="home_about_copy" type="text" defaultValue={siteContent.home_about_copy} required />
              </label>
              <div className="field full">
                <SubmitButton pendingLabel="Saving website...">Save Website Content</SubmitButton>
              </div>
            </form>
          </article>
          ) : null}
        </div>
      </section>
    </DashboardShell>
  );
}
