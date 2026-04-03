import { faqs } from "@/lib/data";

export default function FaqPage() {
  return (
    <main className="container">
      <section className="page-intro">
        <p className="eyebrow">FAQ</p>
        <h1>Answers for common patient and operations questions.</h1>
        <p className="lead">This page helps reduce repetitive front-desk calls while building confidence in the booking and reporting process.</p>
      </section>
      <section className="card-grid">
        {faqs.map((faq) => (
          <article key={faq.question} className="info-card">
            <p className="eyebrow">Question</p>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
