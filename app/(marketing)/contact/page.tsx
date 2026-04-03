import { getSiteContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const siteContent = await getSiteContent();

  return (
    <main className="container">
      <section className="page-intro">
        <p className="eyebrow">Contact</p>
        <h1>Clear clinic contact paths for patients, doctors, and reporting teams.</h1>
        <p className="lead">Use this page to convert calls, WhatsApp inquiries, and local search traffic into confirmed bookings.</p>
      </section>
      <section className="content-grid">
        <article className="info-card">
          <p className="eyebrow">Reach LabMedix</p>
          <h3>Patient and front-desk contact details</h3>
          <p>{siteContent.contact_phone}</p>
          <p>{siteContent.contact_email}</p>
          <p>{siteContent.contact_address}</p>
          <p className="muted">{siteContent.contact_timings}</p>
        </article>
        <article className="form-card">
          <form className="form-grid">
            <label className="field">
              Name
              <input type="text" />
            </label>
            <label className="field">
              Phone
              <input type="tel" />
            </label>
            <label className="field full">
              Message
              <textarea placeholder="Ask about appointments, test pricing, reports, or doctor availability" />
            </label>
            <div className="field full">
              <button type="button" className="solid-button">
                Send Inquiry
              </button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
}
