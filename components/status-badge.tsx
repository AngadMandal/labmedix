type StatusBadgeProps = {
  children: string;
  tone?: "default" | "success" | "warning";
};

export function StatusBadge({ children, tone = "default" }: StatusBadgeProps) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}
