import { createAppointmentAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { getDoctors } from "@/lib/db";

type BookAppointmentPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function BookAppointmentPage({ searchParams }: BookAppointmentPageProps) {
  const doctors = await getDoctors();
  const params = (await searchParams) ?? {};
  const success = typeof params.success === "string" ? params.success : "";

  return (
    <main className="container">
      <section className="page-intro">
        <p className="eyebrow">Book Appointment</p>
        <h1>Online OPD booking with pay-later confirmation.</h1>
        <p className="lead">
          Patients can choose a doctor, preferred time, and visit reason online while your front desk confirms the slot.
        </p>
      </section>
      <section className="form-card">
        <form action={createAppointmentAction} className="form-grid">
          <label className="field">
            Full Name
            <input name="fullName" type="text" placeholder="Patient name" required />
          </label>
          <label className="field">
            Mobile Number
            <input name="phone" type="tel" placeholder="+91" required />
          </label>
          <label className="field">
            Email
            <input name="email" type="email" placeholder="Optional email" />
          </label>
          <label className="field">
            Select Doctor
            <select name="doctorId" defaultValue="" required>
              <option value="" disabled>
                Choose a specialist
              </option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.fullName} - {doctor.specialty}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Preferred Date
            <input name="date" type="date" required />
          </label>
          <label className="field">
            Preferred Time
            <input name="time" type="time" required />
          </label>
          <label className="field">
            Visit Type
            <select name="visitType" defaultValue="OPD">
              <option>OPD</option>
              <option>Follow-up</option>
            </select>
          </label>
          <label className="field full">
            Symptoms or Notes
            <textarea name="notes" placeholder="Optional details for front desk or doctor review" />
          </label>
          <div className="field full">
            <SubmitButton pendingLabel="Booking appointment...">Submit Booking Request</SubmitButton>
            <div className="notice">Demo flow: booking is submitted for confirmation and payment is collected at the clinic.</div>
            {success ? <div className="notice">{success}</div> : null}
          </div>
        </form>
      </section>
    </main>
  );
}
