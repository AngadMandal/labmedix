import { publishReportAction, updateAppointmentStatusAction } from "@/app/actions";
import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { SubmitButton } from "@/components/submit-button";
import { getAppointments, getOperationsMetrics, getReports } from "@/lib/db";
import { APPOINTMENT_STATUSES, REPORT_VISIBILITIES } from "@/lib/status-options";

export const dynamic = "force-dynamic";

export default async function OperationsPage() {
  const [appointments, operationsMetrics, reports] = await Promise.all([
    getAppointments(),
    getOperationsMetrics(),
    getReports()
  ]);

  return (
    <DashboardShell
      role="operations"
      title="Manage bookings, walk-ins, and report desk workflows"
      subtitle="This panel is optimized for front-desk and reporting teams who need high-speed search, queue visibility, and publication controls."
    >
      <section className="dashboard-grid">
        {operationsMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="panel-grid">
        <div>
          <DataTable
            title="Booking Desk"
            columns={["Booking ID", "Patient", "Doctor", "Time", "Status"]}
            rows={appointments.map((item) => [
              item.id,
              item.patientName,
              item.doctorName,
              item.time,
              <div key={item.id}>
                <StatusBadge tone={item.status === "COMPLETED" ? "success" : item.status === "PENDING" ? "warning" : "default"}>
                  {item.status}
                </StatusBadge>
                <form action={updateAppointmentStatusAction} style={{ marginTop: 8 }}>
                  <input type="hidden" name="appointmentId" value={item.recordId} />
                  <input type="hidden" name="redirectTo" value="/operations" />
                  <select name="status" defaultValue={item.status}>
                    {APPOINTMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <SubmitButton className="ghost-button" pendingLabel="Saving...">
                    Save
                  </SubmitButton>
                </form>
              </div>
            ])}
          />
          <DataTable
            title="Report Publishing Desk"
            columns={["Report ID", "Patient", "Title", "Booking", "Access"]}
            rows={reports.map((report) => [
              report.id,
              report.patientName,
              report.title,
              report.bookingId,
              <div key={report.id}>
                <StatusBadge tone={report.access === "PUBLISHED" ? "success" : "warning"}>{report.access}</StatusBadge>
                <form action={publishReportAction} style={{ marginTop: 8 }}>
                  <input type="hidden" name="reportId" value={report.id} />
                  <input type="hidden" name="redirectTo" value="/operations" />
                  <select name="visibility" defaultValue={report.access}>
                    {REPORT_VISIBILITIES.map((visibility) => (
                      <option key={visibility} value={visibility}>
                        {visibility}
                      </option>
                    ))}
                  </select>
                  <SubmitButton className="ghost-button" pendingLabel="Publishing...">
                    Save
                  </SubmitButton>
                </form>
              </div>
            ])}
          />
        </div>
        <div className="stats-grid">
          <article className="panel-card">
            <p className="eyebrow">Walk-In Entry</p>
            <h3>Counter-ready booking flow</h3>
            <p>Create OPD or lab bookings directly for patients arriving at the front desk without sending them through the public forms.</p>
          </article>
          <article className="panel-card">
            <p className="eyebrow">Search Priority</p>
            <h3>Phone, booking ID, patient name</h3>
            <p>The reporting desk is built around fast retrieval of records, reports, and billing status during live patient interactions.</p>
          </article>
          <article className="panel-card">
            <p className="eyebrow">Notifications</p>
            <h3>Publication-ready alerts</h3>
            <p>Trigger email, SMS, or WhatsApp notifications when a report is ready or a booking needs confirmation.</p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
