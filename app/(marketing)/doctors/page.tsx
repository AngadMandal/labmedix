import { getDoctors } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main className="container">
      <section className="page-intro">
        <p className="eyebrow">Doctors</p>
        <h1>Specialist profiles that help patients choose the right consultation quickly.</h1>
        <p className="lead">Each doctor card is ready to be connected to live schedules, appointment slots, and CMS updates.</p>
      </section>
      <section className="card-grid three">
        {doctors.map((doctor) => (
          <article key={doctor.id} className="info-card">
            <p className="eyebrow">{doctor.specialty}</p>
            <h3>{doctor.fullName}</h3>
            <p>{doctor.bio}</p>
            <p className="muted">{doctor.registrationNo}</p>
            <p className="muted">{doctor.availability}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
