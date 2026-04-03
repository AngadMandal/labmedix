import { getServices } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="container">
      <section className="page-intro">
        <p className="eyebrow">Tests & Services</p>
        <h1>OPD consultations, routine diagnostics, and health packages in one digital catalog.</h1>
        <p className="lead">
          The same service catalog can power public booking, admin pricing controls, lab workflow routing, and billing.
        </p>
      </section>
      <section className="card-grid three">
        {services.map((service) => (
          <article key={service.id} className="info-card">
            <p className="eyebrow">{service.category}</p>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <p>{formatCurrency(service.price)}</p>
            {service.turnaroundTime ? <p className="muted">Turnaround: {service.turnaroundTime}</p> : null}
          </article>
        ))}
      </section>
    </main>
  );
}
