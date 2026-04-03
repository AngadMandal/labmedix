import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { getAppointments, getDoctorMetrics } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DoctorPage() {
  const [appointments, doctorMetrics] = await Promise.all([getAppointments(), getDoctorMetrics()]);

  return (
    <DashboardShell
      role="doctor"
      title="Daily queue, follow-ups, and lightweight consultation tracking"
      subtitle="The doctor panel is intentionally focused so specialists can move through appointments quickly without full EMR overhead."
    >
      <section className="dashboard-grid">
        {doctorMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="panel-grid">
        <DataTable
          title="Today's Queue"
          columns={["Booking ID", "Patient", "Visit Type", "Time", "Status"]}
          rows={appointments.map((item) => [
            item.id,
            item.patientName,
            item.type,
            item.time,
            <StatusBadge key={item.id} tone={item.status === "COMPLETED" ? "success" : item.status === "PENDING" ? "warning" : "default"}>
              {item.status}
            </StatusBadge>
          ])}
        />
        <div className="stats-grid">
          <article className="panel-card">
            <p className="eyebrow">Patient History</p>
            <h3>Quick summary access</h3>
            <p>Open recent visits, lab reports, and prior prescriptions without forcing the doctor through a large EMR workflow.</p>
          </article>
          <article className="panel-card">
            <p className="eyebrow">Schedule Changes</p>
            <h3>Reschedule visibility</h3>
            <p>Doctors can quickly see which consultations were moved and keep queue planning aligned with front-desk updates.</p>
          </article>
          <article className="panel-card">
            <p className="eyebrow">Commission Hooks</p>
            <h3>Schema-ready summary</h3>
            <p>Doctor commission and earning snapshots are prepared in the data model for the next iteration.</p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
