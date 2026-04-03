import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { getAppointments, getBills, getPatientMetrics, getReports } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PatientPage() {
  const [appointments, bills, patientMetrics, reports] = await Promise.all([
    getAppointments(),
    getBills(),
    getPatientMetrics(),
    getReports()
  ]);

  return (
    <DashboardShell
      role="patient"
      title="Patient access to bookings, bills, and reports"
      subtitle="Patients can review upcoming visits, lab history, published reports, and payment status from one calm dashboard."
    >
      <section className="dashboard-grid">
        {patientMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="panel-grid">
        <div>
          <DataTable
            title="My Appointments"
            columns={["Booking ID", "Doctor", "Department", "Time", "Status"]}
            rows={appointments.map((item) => [
              item.id,
              item.doctorName,
              item.department,
              item.time,
              <StatusBadge key={item.id} tone={item.status === "COMPLETED" ? "success" : item.status === "PENDING" ? "warning" : "default"}>
                {item.status}
              </StatusBadge>
            ])}
          />
          <DataTable
            title="My Bills"
            columns={["Bill ID", "Category", "Amount", "Payment", "Date"]}
            rows={bills.map((bill) => [
              bill.id,
              bill.category,
              formatCurrency(bill.amount),
              <StatusBadge key={bill.id} tone={bill.paymentStatus === "PAID" ? "success" : bill.paymentStatus === "PARTIAL" ? "warning" : "default"}>
                {bill.paymentStatus}
              </StatusBadge>,
              bill.issuedAt
            ])}
          />
        </div>
        <div className="stats-grid">
          {reports.map((report) => (
            <article key={report.id} className="panel-card">
              <p className="eyebrow">{report.bookingId}</p>
              <h3>{report.title}</h3>
              <p>{report.publishedAt}</p>
              <StatusBadge tone={report.access === "PUBLISHED" ? "success" : "warning"}>{report.access}</StatusBadge>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
