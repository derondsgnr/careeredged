import { ScrollReveal } from "../animations/ScrollReveal";

const features = [
  { name: "Career discovery assessment", free: true, plus: true, pro: true },
  { name: "Personalized roadmap", free: true, plus: true, pro: true },
  { name: "Resume scoring", free: true, plus: true, pro: true },
  { name: "Community access", free: true, plus: true, pro: true },
  { name: "Job matching", free: "5/month", plus: "Unlimited", pro: "Unlimited" },
  { name: "Interview prep", free: false, plus: true, pro: true },
  { name: "Mentor connections", free: false, plus: true, pro: true },
  { name: "Progress analytics", free: false, plus: true, pro: true },
  { name: "Advanced career analytics", free: false, plus: false, pro: true },
  { name: "Employer visibility", free: false, plus: false, pro: true },
  { name: "Priority support", free: false, plus: false, pro: true },
  { name: "Team accounts", free: false, plus: false, pro: true },
];

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-text-primary">{value}</span>;
  }
  if (value) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent mx-auto">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  return <span className="text-text-secondary opacity-30">—</span>;
}

export function PricingCompare() {
  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        <ScrollReveal variant="sm">
          <p className="text-eyebrow text-accent mb-8">Compare plans</p>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <h2 className="h2 text-text-primary mb-16">
            Everything you get.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={2}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border-light">
                  <th className="text-left text-sm font-medium text-text-secondary pb-4 pr-8 w-[40%]">
                    Feature
                  </th>
                  <th className="text-center text-sm font-medium text-text-secondary pb-4 px-4">
                    Free
                  </th>
                  <th className="text-center text-sm font-medium text-text-secondary pb-4 px-4">
                    Edge Plus
                  </th>
                  <th className="text-center text-sm font-medium text-text-secondary pb-4 px-4">
                    Edge Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((f) => (
                  <tr key={f.name} className="border-b border-border-light">
                    <td className="text-sm text-text-primary py-4 pr-8">
                      {f.name}
                    </td>
                    <td className="text-center py-4 px-4">
                      <Cell value={f.free} />
                    </td>
                    <td className="text-center py-4 px-4">
                      <Cell value={f.plus} />
                    </td>
                    <td className="text-center py-4 px-4">
                      <Cell value={f.pro} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
