import { createLabOrderAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { getServices } from "@/lib/db";

type BookTestPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function BookTestPage({ searchParams }: BookTestPageProps) {
  const services = await getServices();
  const labServices = services.filter((service) => service.category !== "OPD");
  const params = (await searchParams) ?? {};
  const success = typeof params.success === "string" ? params.success : "";

  return (
    <main className="container">
      <section className="page-intro">
        <p className="eyebrow">Book Lab Test</p>
        <h1>Digital pathology booking with reporting desk handoff.</h1>
        <p className="lead">Book routine tests and packages online, then let the lab team process samples and publish reports through the internal panel.</p>
      </section>
      <section className="form-card">
        <form action={createLabOrderAction} className="form-grid">
          <label className="field">
            Patient Name
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
            Test / Package
            <select name="serviceId" defaultValue="" required>
              <option value="" disabled>
                Select test or package
              </option>
              {labServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Preferred Collection Date
            <input type="date" disabled />
          </label>
          <label className="field full">
            Additional Instructions
            <textarea name="notes" placeholder="Fasting requirement, home collection note, or doctor referral details" />
          </label>
          <div className="field full">
            <SubmitButton pendingLabel="Creating lab booking...">Submit Lab Booking</SubmitButton>
            <div className="notice">Demo flow: the booking enters the lab queue and remains unpaid until counter billing.</div>
            {success ? <div className="notice">{success}</div> : null}
          </div>
        </form>
      </section>
    </main>
  );
}
