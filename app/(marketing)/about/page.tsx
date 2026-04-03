import { SectionHeading } from "@/components/section-heading";
import { highlights, siteConfig } from "@/lib/data";

export default function AboutPage() {
  return (
    <main className="container">
      <section className="page-intro">
        <p className="eyebrow">About LabMedix</p>
        <h1>Built to feel professional outside and operationally sharp inside.</h1>
        <p className="lead">
          LabMedix combines a polished patient-facing brand with the internal systems needed to run appointments, diagnostics,
          billing, and reporting from one coordinated platform.
        </p>
      </section>
      <section className="content-grid">
        <article className="info-card">
          <SectionHeading
            eyebrow="Mission"
            title="Make every patient interaction faster, clearer, and more reliable."
            copy="The platform is designed around OPD, lab, and reporting workflows so your team can reduce manual entries, improve follow-up visibility, and publish reports with better control."
          />
        </article>
        <article className="info-card">
          <p className="eyebrow">Operational Focus</p>
          <h3>Current branch setup</h3>
          <p>{siteConfig.address}</p>
          <ul className="check-list">
            {highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
