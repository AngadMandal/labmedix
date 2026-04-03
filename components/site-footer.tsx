import Link from "next/link";

import { navigation } from "@/lib/data";
import { getSiteContent } from "@/lib/db";

export async function SiteFooter() {
  const siteContent = await getSiteContent();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="eyebrow">LabMedix Digital System</p>
          <h3>Built for OPD, diagnostics, reporting, and patient trust.</h3>
          <p>{siteContent.site_tagline}</p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <div className="footer-links">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Contact</p>
          <p>{siteContent.contact_phone}</p>
          <p>{siteContent.contact_email}</p>
          <p>{siteContent.contact_address}</p>
          <a href={siteContent.contact_whatsapp} target="_blank" rel="noreferrer" className="solid-button inline-button">
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
