import { ScrollReveal } from "../animations/ScrollReveal";

const team = [
  {
    name: "Sophia AI",
    role: "Career Intelligence Engine",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
    description: "The AI backbone of every CareerEdge roadmap.",
  },
  {
    name: "Dayo Adeyemi",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    description: "Product-obsessed. Career mobility advocate.",
  },
  {
    name: "Amara Osei",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    description: "Designing the future of career planning.",
  },
  {
    name: "Liam Chen",
    role: "Head of Engineering",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    description: "Building the intelligence layer.",
  },
  {
    name: "Fatima Al-Rashid",
    role: "Head of Partnerships",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    description: "Connecting employers, institutions, and talent.",
  },
  {
    name: "Marcus Thompson",
    role: "Head of Data Science",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    description: "Labor market intelligence at scale.",
  },
];

export function Team() {
  return (
    <section className="section bg-bg-primary">
      <div className="container-main">
        <ScrollReveal variant="sm">
          <p className="text-eyebrow text-accent mb-8">The team</p>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <h2 className="h2 text-text-primary mb-20">
            The people behind the plan.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {team.map((member, i) => (
            <ScrollReveal key={member.name} variant="sm" delay={(i % 3) + 1}>
              <div className="group">
                {/* Photo */}
                <div className="aspect-[3/4] rounded-[var(--radius-lg)] overflow-hidden mb-5 bg-bg-darker-gray">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <p className="text-large text-text-primary font-medium mb-1">
                  {member.name}
                </p>
                <p className="text-small text-accent mb-2">{member.role}</p>
                <p className="text-small text-text-secondary">
                  {member.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
