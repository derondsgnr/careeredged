interface LandingFooterProps {
  onNavigate: (page: string) => void;
}

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "EdgePath", id: "edgepath" },
      { label: "EdgeJobs", id: "jobs" },
      { label: "Explore Careers", id: "careers" },
      { label: "ResumeEdge", id: "signup" },
      { label: "Meet Sophia", id: "about" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Individuals", id: "solutions-individuals" },
      { label: "Employers", id: "solutions-employers" },
      { label: "Institutions", id: "solutions-institutions" },
      { label: "Government", id: "solutions-government" },
      { label: "NGOs", id: "solutions-ngos" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", id: "about" },
      { label: "Careers", id: "careers" },
      { label: "Privacy", id: "privacy" },
      { label: "Terms", id: "terms" },
    ],
  },
];

export function LandingFooter({ onNavigate }: LandingFooterProps) {
  return (
    <footer
      className="relative"
      style={{ background: "var(--ce-surface-bg)", borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Top section */}
        <div className="py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-5">
              <svg width="24" height="32" viewBox="0 0 133 180" fill="none">
                <path d="M132.41 131.992H99.5417V88.8695L93.0906 80.7536L52.8237 80.6843L52.8815 47.8164L108.964 47.932L132.41 77.3894V131.992Z" fill="var(--ce-cyan)"/>
                <path d="M88.0699 72.3383L50.8918 102.975L71.7866 128.331L108.965 97.6947L88.0699 72.3383Z" fill="var(--ce-cyan)"/>
                <path d="M132.905 179.507H35.3766L0 135.379V36.6021L36.4633 0H132.905V32.8679H50.1169L32.8563 50.1747V123.83L51.1458 146.651H132.905V179.507Z" fill="var(--ce-cyan)"/>
              </svg>
              <span
                className="text-[var(--ce-text-primary)] tracking-[-0.02em]"
                style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, fontSize: "16px" }}
              >
                CareerEdged
              </span>
            </div>
            <p
              className="text-[14px] leading-[1.7] max-w-[320px] mb-6"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-secondary)" }}
            >
              Career intelligence that maps where you are to where you belong. 
              Guided by Sophia. Built around your journey.
            </p>
            <p
              className="text-[12px]"
              style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
            >
              Your data stays yours. Always.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title} className="lg:col-span-2">
              <h4
                className="text-[11px] uppercase tracking-[0.12em] mb-4"
                style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600, color: "var(--ce-text-secondary)" }}
              >
                {group.title}
              </h4>
              <div className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => onNavigate(link.id)}
                    className="text-left text-[13px] transition-colors duration-200 cursor-pointer"
                    style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 500, color: "var(--ce-text-secondary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ce-text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ce-text-secondary)"; }}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(var(--ce-glass-tint),0.04)" }}
        >
          <p
            className="text-[12px]"
            style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
          >
            &copy; {new Date().getFullYear()} CareerEdge. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <button
                key={item}
                className="text-[12px] transition-colors duration-200 cursor-pointer"
                style={{ fontFamily: "'Satoshi', sans-serif", color: "var(--ce-text-quaternary)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ce-text-secondary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ce-text-quaternary)"; }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
