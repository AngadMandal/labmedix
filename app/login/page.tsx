import Link from "next/link";

import { demoAccounts } from "@/lib/data";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const redirect = typeof params.redirect === "string" ? params.redirect : undefined;
  const email = typeof params.email === "string" ? params.email : "";

  return (
    <main className="container">
      <section className="page-intro">
        <p className="eyebrow">Portal Login</p>
        <h1>One login system, five role-based panels.</h1>
        <p className="lead">
          This demo login sets a secure role cookie and redirects each user to the correct LabMedix dashboard.
        </p>
      </section>
      <section className="login-card">
        <div className="login-grid">
          <div>
            <form action="/api/auth/login" method="post" className="form-grid">
              <input type="hidden" name="redirect" value={redirect} />
              <label className="field full">
                Email
                <input name="email" type="email" placeholder="admin@labmedix.in" defaultValue={email} required />
              </label>
              <label className="field full">
                Password
                <input name="password" type="password" placeholder="Any password for demo" required />
              </label>
              <div className="field full">
                <button type="submit" className="solid-button">
                  Sign In
                </button>
                <div className="notice">Demo mode: role and permission access are assigned by staff email.</div>
              </div>
            </form>
          </div>
          <div>
            <p className="eyebrow">Demo Accounts</p>
            <div className="login-options">
              {demoAccounts.map((account) => (
                <div key={account.email} className="login-option">
                  <div>
                    <strong>{account.label}</strong>
                    <p className="muted">{account.email}</p>
                  </div>
                  <Link href={`/login?email=${encodeURIComponent(account.email)}`} className="ghost-button">
                    Use Account
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
