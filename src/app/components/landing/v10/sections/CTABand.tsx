/*
  Single horizontal marquee — clean, branded, energetic.
  Uses the CareerEdge arrow as separator. Alternating phrases
  that reinforce the brand promise. One band, no rotation.
*/

const phrases = [
  "Your career, mapped",
  "4 minutes to clarity",
  "190+ countries",
  "Strengths-first",
  "Not a template",
  "Real roadmaps",
  "Built around you",
  "12K+ plans built",
];

function ArrowSeparator() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="opacity-40 shrink-0 mx-2"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function BandContent() {
  return (
    <>
      {phrases.map((phrase, i) => (
        <span key={i} className="inline-flex items-center shrink-0">
          <span>{phrase}</span>
          <ArrowSeparator />
        </span>
      ))}
    </>
  );
}

export function CTABand() {
  return (
    <div className="bg-[#B3FF3B] text-[#12110E] overflow-hidden py-5">
      <div className="marquee-track flex items-center whitespace-nowrap text-[20px] font-medium tracking-[-0.3px]">
        <BandContent />
        <BandContent />
        <BandContent />
        <BandContent />
      </div>
    </div>
  );
}
