import { Link } from "react-router";
import { Logo } from "../ui/Logo";
import { BtnText } from "../ui/BtnText";

const productLinks = [
  { label: "EdgePath", href: "/signup" },
  { label: "EdgeJobs", href: "/edgejobs" },
  { label: "Explore Careers", href: "/explore" },
  { label: "ResumeEdge", href: "#" },
  { label: "Meet Sophia", href: "#" },
];

const solutionLinks = [
  { label: "Individuals", href: "/solutions/individuals" },
  { label: "Employers", href: "/solutions/employers" },
  { label: "Institutions", href: "/solutions/institutions" },
  { label: "Government", href: "/solutions/government" },
  { label: "NGOs", href: "/solutions/ngos" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Careers", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

function FooterLinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-label opacity-50 mb-4">{title}</p>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link to={link.href} className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="section-dark relative overflow-hidden">
      {/* Cyan gradient wash — ambient glow rising from bottom */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "70%",
            background: "linear-gradient(to top, rgba(0, 158, 250, 0.35) 0%, rgba(0, 158, 250, 0.15) 30%, rgba(0, 158, 250, 0.04) 60%, transparent 100%)",
          }}
        />
      </div>
      <div className="section relative z-10">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-start pb-16 border-b border-current/10">
            <div>
              <div className="mb-6">
                <Logo variant="white" />
              </div>
              <p className="text-large opacity-70 max-w-md">
                Career intelligence that maps where you are to where you belong. Guided by Sophia. Built around your journey.
              </p>
            </div>

            <div>
              <p className="text-label opacity-50 mb-4">Stay in the loop</p>
              <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 rounded-[var(--radius-base)] bg-current/10 border border-current/20 text-inherit placeholder:opacity-40 text-sm focus:outline-none focus:border-accent"
                />
                <button type="submit" className="btn btn-white">
                  <BtnText>Subscribe</BtnText>
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
            <FooterLinkColumn title="Product" links={productLinks} />
            <FooterLinkColumn title="Solutions" links={solutionLinks} />
            <FooterLinkColumn title="Company" links={companyLinks} />
            <div>
              <p className="text-label opacity-50 mb-4">Data</p>
              <p className="text-sm opacity-70">Your data stays yours. Always.</p>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-current/10 pt-8 pb-4">
            <p className="text-small opacity-40">
              &copy; 2025 CareerEdge. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
