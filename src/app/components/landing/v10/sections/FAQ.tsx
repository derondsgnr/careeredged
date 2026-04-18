import { useState } from "react";
import { ScrollReveal } from "../animations/ScrollReveal";

const faqs = [
  {
    q: "Is CareerEdge really free?",
    a: "Yes. The free plan includes career discovery, a personalized roadmap, resume scoring, and community access. Paid plans add deeper tools — but you can build a real career plan without spending anything.",
  },
  {
    q: "How is this different from a career coach?",
    a: "A career coach charges $200–$500/hour and has limited availability. CareerEdge gives you always-on guidance personalized to your specific strengths and goals. Use it as a standalone tool or alongside a coach.",
  },
  {
    q: "How long does it take to get my roadmap?",
    a: "About 4 minutes. Answer a few questions about your experience, goals, and work style. Your personalized roadmap generates immediately.",
  },
  {
    q: "What if I don't know what I want to do?",
    a: "That's exactly what the career discovery assessment is for. It helps you find careers that match your strengths and values — including ones you've never considered. You don't need to know where you're going to start.",
  },
  {
    q: "Is my data safe?",
    a: "Yes. Your data is encrypted, never sold to third parties, and you control what's visible to employers or mentors. We don't sell data. Full stop.",
  },
  {
    q: "Can CareerEdge help me if I'm switching industries?",
    a: "Especially so. Career changers are one of the groups CareerEdge is built for. The roadmap identifies transferable skills, flags gaps, and maps a realistic transition path — including what roles to target first.",
  },
  {
    q: "Can I use this if I'm still in school?",
    a: "Absolutely. Many students use CareerEdge to explore options before graduation, build their resumes, and connect with mentors in their target fields.",
  },
  {
    q: "How does the AI work?",
    a: "CareerEdge analyzes your skills, goals, and work style to generate a personalized roadmap and recommendations. The logic is built on real labor market data and career research — not just pattern-matching.",
  },
];

function AccordionItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border-b border-border-light overflow-hidden transition-all duration-300 ${
        isOpen ? "faq-open" : ""
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-[16px] leading-[26px] tracking-[-0.48px] text-text-primary group-hover:opacity-70 transition-opacity">{q}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="faq-arrow text-text-secondary shrink-0 ml-8"
        >
          <line x1="12" y1="5" x2="12" y2="19" className={`transition-opacity duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`} />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
      <div className="faq-content">
        <div className="pb-5">
          <p className="text-sm text-text-secondary leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="h2 text-text-primary mb-5">
              Common questions.
            </h2>
          </div>
        </ScrollReveal>

        <div className="max-w-[640px] mx-auto">
          {faqs.map((faq, i) => (
            <ScrollReveal key={i} variant="sm" delay={Math.min(i + 1, 4)}>
              <AccordionItem
                q={faq.q}
                a={faq.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
