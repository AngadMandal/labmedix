import Link from "next/link";

import { MetricCard } from "@/components/metric-card";
import { SectionHeading } from "@/components/section-heading";
import { heroMetrics, highlights } from "@/lib/data";
import { getDoctors, getServices, getSiteContent } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [siteContent, doctors, services] = await Promise.all([getSiteContent(), getDoctors(), getServices()]);

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Professional Healthcare Website</p>
            <h1>{siteContent.home_hero_title}</h1>
            <p className="lead">{siteContent.home_hero_copy}</p>
            <div className="hero-actions">
              <Link href="/book-appointment" className="solid-button">
                Book Appointment
              </Link>
              <Link href="/book-test" className="ghost-button">
                Book Lab Test
              </Link>
              <Link href="/reports" className="ghost-button">
                Download Report
              </Link>
            </div>
            <div className="metric-grid">
              {heroMetrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </div>
          <aside className="hero-aside">
            <p className="eyebrow">At a Glance</p>
            <h2>{siteContent.site_name}</h2>
            <p>{siteContent.site_tagline}</p>
            <ul>
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="hero-actions">
              <a href={`tel:${siteContent.contact_phone.replace(/\s+/g, "")}`} className="solid-button">
                {siteContent.contact_phone}
              </a>
              <a href={siteContent.contact_whatsapp} target="_blank" rel="noreferrer" className="ghost-button">
                WhatsApp Desk
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Why LabMedix"
            title={siteContent.home_about_title}
            copy={siteContent.home_about_copy}
          />
          <div className="feature-grid">
            <article className="feature-card">
              <p className="eyebrow">Admin Control</p>
              <h3>Operations, billing, CMS, and analytics in one place</h3>
              <p>Track revenue, manage doctors, control slots, publish reports, and update the website without switching tools.</p>
            </article>
            <article className="feature-card">
              <p className="eyebrow">Patient Experience</p>
              <h3>Simple booking and secure report access</h3>
              <p>Patients can book OPD or lab services, pay later at the center, and access bills, receipts, and reports digitally.</p>
            </article>
            <article className="feature-card">
              <p className="eyebrow">Clinical Workflow</p>
              <h3>Doctor and lab panels with focused daily task views</h3>
              <p>Queue visibility, report progression, upload steps, and patient history are structured for quick operational use.</p>
            </article>
            <article className="feature-card">
              <p className="eyebrow">Reporting Desk</p>
              <h3>Booking and report publication for front-desk teams</h3>
              <p>Handle walk-ins, reschedules, report release, and patient follow-ups from one dashboard built for search-heavy work.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Specialists"
            title="Trusted doctors and focused clinics"
            copy="Highlight specialist availability clearly so new patients can book faster and front-desk staff can route consultations correctly."
          />
          <div className="card-grid three">
            {doctors.slice(0, 3).map((doctor) => (
              <article key={doctor.id} className="info-card">
                <p className="eyebrow">{doctor.specialty}</p>
                <h3>{doctor.fullName}</h3>
                <p>{doctor.bio}</p>
                <p className="muted">{doctor.availability}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-grid">
          <div>
            <SectionHeading
              eyebrow="Diagnostics"
              title="Core tests and packages ready for online booking"
              copy="Book now, pay later keeps the patient flow simple while preserving billing control at the center."
            />
          </div>
          <div className="card-grid">
            {services.slice(0, 4).map((service) => (
              <article key={service.id} className="info-card">
                <p className="eyebrow">{service.category}</p>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <p>{formatCurrency(service.price)}</p>
                {service.turnaroundTime ? <p className="muted">TAT: {service.turnaroundTime}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
