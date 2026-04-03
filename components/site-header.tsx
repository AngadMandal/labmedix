import Link from "next/link";

import { navigation } from "@/lib/data";
import { getSiteContent } from "@/lib/db";

export async function SiteHeader() {
  const siteContent = await getSiteContent();

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link href="/" className="brand-mark">
          <span className="brand-kicker">Healthcare ERP</span>
          <span className="brand-name">{siteContent.site_name}</span>
        </Link>
        <nav className="nav-links">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <a href={`tel:${siteContent.contact_phone.replace(/\s+/g, "")}`} className="ghost-button">
            Call Now
          </a>
          <Link href="/login" className="solid-button">
            Portal Login
          </Link>
        </div>
      </div>
    </header>
  );
}
