import { createReportAction, updateLabOrderStatusAction } from "@/app/actions";
import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";
import { SubmitButton } from "@/components/submit-button";
import { getLabMetrics, getLabOrders } from "@/lib/db";
import { LAB_ORDER_STATUSES } from "@/lib/status-options";

export const dynamic = "force-dynamic";

export default async function LabPage() {
  const [labMetrics, labOrders] = await Promise.all([getLabMetrics(), getLabOrders()]);

  return (
    <DashboardShell
      role="lab"
      title="Track collection, processing, report readiness, and delivery"
      subtitle="Lab staff can move every order across the sample lifecycle while keeping reporting and patient visibility in sync."
    >
      <section className="dashboard-grid">
        {labMetrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </section>
      <section className="panel-grid">
        <DataTable
          title="Live Lab Orders"
          columns={["Order ID", "Patient", "Test", "Booked At", "Status", "Report"]}
          rows={labOrders.map((order) => [
            order.id,
            order.patientName,
            order.testName,
            order.bookedAt,
            <div key={order.id}>
              <StatusBadge
                tone={order.status === "REPORT_READY" || order.status === "DELIVERED" ? "success" : order.status === "IN_PROCESS" ? "warning" : "default"}
              >
                {order.status}
              </StatusBadge>
              <form action={updateLabOrderStatusAction} style={{ marginTop: 8 }}>
                <input type="hidden" name="labOrderId" value={order.recordId} />
                <input type="hidden" name="redirectTo" value="/lab" />
                <select name="status" defaultValue={order.status}>
                  {LAB_ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <SubmitButton className="ghost-button" pendingLabel="Updating...">
                  Save
                </SubmitButton>
              </form>
            </div>,
            order.reportReady ? "Ready to share" : "Pending"
          ])}
        />
        <div className="stats-grid">
          <article className="panel-card">
            <p className="eyebrow">Sample Tracking</p>
            <h3>Barcode-ready later</h3>
            <p>The MVP supports manual sample code and status tracking, with space for future label and barcode workflows.</p>
          </article>
          <article className="panel-card">
            <p className="eyebrow">Report Publishing</p>
            <h3>PDF-first delivery</h3>
            <p>Upload final reports and pass them to the operations team or patient portal with an auditable publication state.</p>
            <form action={createReportAction} className="form-grid" style={{ marginTop: 12 }}>
              <label className="field full">
                Order
                <select name="labOrderId" defaultValue="">
                  <option value="" disabled>
                    Select lab order
                  </option>
                  {labOrders.map((order) => (
                    <option key={order.recordId} value={order.recordId}>
                      {order.id} - {order.patientName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field full">
                Report Title
                <input name="title" type="text" placeholder="CBC Report" required />
              </label>
              <label className="field full">
                Report URL
                <input name="fileUrl" type="text" placeholder="/reports/sample-report.pdf" required />
              </label>
              <input type="hidden" name="redirectTo" value="/lab" />
              <div className="field full">
                <SubmitButton pendingLabel="Creating report...">Create Internal Report</SubmitButton>
              </div>
            </form>
          </article>
          <article className="panel-card">
            <p className="eyebrow">Turnaround Control</p>
            <h3>Test catalog includes TAT</h3>
            <p>Each lab service can store expected turnaround time to support patient communication and internal tracking.</p>
          </article>
        </div>
      </section>
    </DashboardShell>
  );
}
