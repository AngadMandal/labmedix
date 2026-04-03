import { DashboardMetric } from "@/lib/types";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <article className="metric-card">
      <p>{metric.label}</p>
      <h3>{metric.value}</h3>
      <span>{metric.note}</span>
    </article>
  );
}
