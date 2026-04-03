import { StatusBadge } from "@/components/status-badge";
import { getReports } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const reports = await getReports();

  return (
    <main className="container">
      <section className="page-intro">
        <p className="eyebrow">Reports</p>
        <h1>Search, verify, and download published lab reports securely.</h1>
        <p className="lead">This public report page is designed to connect to secure patient authentication or booking-based access in production.</p>
      </section>
      <section className="form-card">
        <form className="form-grid">
          <label className="field">
            Booking ID
            <input type="text" placeholder="LAB-240501" />
          </label>
          <label className="field">
            Mobile Number
            <input type="tel" placeholder="+91" />
          </label>
          <div className="field full">
            <button type="button" className="solid-button">
              Find Report
            </button>
          </div>
        </form>
      </section>
      <section className="section">
        <div className="card-grid">
          {reports.map((report) => (
            <article key={report.id} className="info-card">
              <p className="eyebrow">{report.bookingId}</p>
              <h3>{report.title}</h3>
              <p>{report.patientName}</p>
              <p className="muted">{report.publishedAt}</p>
              <StatusBadge tone={report.access === "PUBLISHED" ? "success" : "warning"}>{report.access}</StatusBadge>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
