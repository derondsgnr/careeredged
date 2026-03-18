import svgPaths from "./svg-hotijf74w3";

function Container() {
  return <div className="absolute h-[851px] left-0 top-0 w-[1099px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1099 851\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -69.498 -69.498 0 549.5 425.5)\\'><stop stop-color=\\'rgba(255,255,255,0.04)\\' offset=\\'0.00090992\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.00090992\\'/></radialGradient></defs></svg>')" }} />;
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_13_1062)" id="Icon">
          <path d={svgPaths.pc012c00} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1426c1f0} id="Vector_2" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p206e4880} id="Vector_3" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_13_1062">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[rgba(34,211,238,0.1)] relative rounded-[10px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[63.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[16.5px] left-0 not-italic text-[#6b7280] text-[11px] top-[1.5px] whitespace-nowrap">Career Score</p>
      </div>
    </div>
  );
}

function DashboardCards1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="DashboardCards">
      <Container3 />
      <Text />
    </div>
  );
}

function DashboardCards2() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="DashboardCards">
      <p className="absolute font-['Urbanist:Medium',sans-serif] leading-[30px] left-0 not-italic text-[#e8e8ed] text-[20px] top-0 whitespace-nowrap">72</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] col-1 justify-self-stretch relative rounded-[16px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-px pt-[15px] px-[15px] relative size-full">
        <DashboardCards1 />
        <DashboardCards2 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.03)]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p33035500} id="Vector" stroke="var(--stroke-0, #B3FF3B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[rgba(179,255,59,0.1)] relative rounded-[10px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5px] relative size-full">
        <Icon1 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[43.75px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[16.5px] left-0 not-italic text-[#6b7280] text-[11px] top-[1.5px] whitespace-nowrap">EdgeGas</p>
      </div>
    </div>
  );
}

function DashboardCards3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="DashboardCards">
      <Container5 />
      <Text1 />
    </div>
  );
}

function DashboardCards4() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="DashboardCards">
      <p className="absolute font-['Urbanist:Medium',sans-serif] leading-[30px] left-0 not-italic text-[#e8e8ed] text-[20px] top-0 whitespace-nowrap">50</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] col-2 justify-self-stretch relative rounded-[16px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-px pt-[15px] px-[15px] relative size-full">
        <DashboardCards3 />
        <DashboardCards4 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.03)]" />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.pd1f0180} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p1c197ec0} id="Vector_2" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M5.83333 5.25H4.66667" id="Vector_3" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 7.58333H4.66667" id="Vector_4" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M9.33333 9.91667H4.66667" id="Vector_5" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] relative rounded-[10px] shrink-0 size-[24px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[49.086px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[16.5px] left-0 not-italic text-[#6b7280] text-[11px] top-[1.5px] whitespace-nowrap">ATS Score</p>
      </div>
    </div>
  );
}

function DashboardCards5() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="DashboardCards">
      <Container7 />
      <Text2 />
    </div>
  );
}

function DashboardCards6() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="DashboardCards">
      <p className="absolute font-['Urbanist:Medium',sans-serif] leading-[30px] left-0 not-italic text-[#e8e8ed] text-[20px] top-0 whitespace-nowrap">—</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] col-3 justify-self-stretch relative rounded-[16px] row-1 self-stretch shrink-0" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[8px] items-start pb-px pt-[15px] px-[15px] relative size-full">
        <DashboardCards5 />
        <DashboardCards6 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.03)]" />
    </div>
  );
}

function DashboardCards() {
  return (
    <div className="h-[92px] relative shrink-0 w-[999px]" data-name="DashboardCards">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] relative size-full">
        <Container2 />
        <Container4 />
        <Container6 />
      </div>
    </div>
  );
}

function Container10() {
  return <div className="bg-[#22d3ee] rounded-[16777200px] shadow-[0px_0px_8px_0px_rgba(34,211,238,0.4)] shrink-0 size-[10px]" data-name="Container" />;
}

function Text3() {
  return (
    <div className="flex-[1_0_0] h-[19.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Urbanist:Medium',sans-serif] leading-[19.5px] left-0 not-italic text-[#e8e8ed] text-[13px] top-[0.5px] whitespace-nowrap">Product Design Roadmap</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[163.391px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container10 />
        <Text3 />
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[8px] size-[10px] top-[5.25px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g clipPath="url(#clip0_13_994)" id="Icon">
          <path d={svgPaths.p19135900} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M8.33333 1.25V2.91667" id="Vector_2" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M9.16667 2.08333H7.5" id="Vector_3" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M1.66667 7.08333V7.91667" id="Vector_4" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
          <path d="M2.08333 7.5H1.25" id="Vector_5" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
        <defs>
          <clipPath id="clip0_13_994">
            <rect fill="white" height="10" width="10" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[rgba(34,211,238,0.08)] h-[20.5px] relative rounded-[10px] shrink-0 w-[65.984px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon3 />
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[16.5px] left-[22px] not-italic text-[#22d3ee] text-[11px] top-[3.5px] whitespace-nowrap">{` Phase 1`}</p>
      </div>
    </div>
  );
}

function DashboardCards7() {
  return (
    <div className="content-stretch flex h-[20.5px] items-center justify-between relative shrink-0 w-full" data-name="DashboardCards">
      <Container9 />
      <Text4 />
    </div>
  );
}

function Container11() {
  return <div className="bg-[rgba(34,211,238,0.5)] flex-[1_0_0] h-[6px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" />;
}

function Container12() {
  return <div className="bg-[rgba(255,255,255,0.04)] flex-[1_0_0] h-[6px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" />;
}

function Container13() {
  return <div className="bg-[rgba(255,255,255,0.04)] flex-[1_0_0] h-[6px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" />;
}

function Container14() {
  return <div className="bg-[rgba(255,255,255,0.04)] flex-[1_0_0] h-[6px] min-h-px min-w-px rounded-[16777200px]" data-name="Container" />;
}

function DashboardCards8() {
  return (
    <div className="content-stretch flex gap-[6px] h-[6px] items-start relative shrink-0 w-full" data-name="DashboardCards">
      <Container11 />
      <Container12 />
      <Container13 />
      <Container14 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-[9px] size-[10px] top-[8.25px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Icon">
          <path d={svgPaths.p1098da98} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        </g>
      </svg>
    </div>
  );
}

function Text5() {
  return (
    <div className="bg-[rgba(34,211,238,0.08)] h-[26.5px] relative rounded-[10px] shrink-0 w-[124.109px]" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[rgba(34,211,238,0.1)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon4 />
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[16.5px] left-[23px] not-italic text-[#e8e8ed] text-[11px] top-[6.5px] whitespace-nowrap">{` Discover & Position`}</p>
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] h-[26.5px] relative rounded-[10px] shrink-0 w-[73.117px]" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.04)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[9px] py-[5px] relative size-full">
        <p className="font-['Satoshi:Regular',sans-serif] leading-[16.5px] not-italic relative shrink-0 text-[#6b7280] text-[11px] whitespace-nowrap">Weeks 1–3</p>
      </div>
    </div>
  );
}

function DashboardCards9() {
  return (
    <div className="content-stretch flex gap-[8px] h-[26.5px] items-center relative shrink-0 w-full" data-name="DashboardCards">
      <Text5 />
      <Text6 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-[13px] size-[12px] top-[11px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g clipPath="url(#clip0_13_1028)" id="Icon">
          <path d={svgPaths.pecd8080} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 1.5V3.5" id="Vector_2" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11 2.5H9" id="Vector_3" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 8.5V9.5" id="Vector_4" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 9H1.5" id="Vector_5" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_13_1028">
            <rect fill="white" height="12" width="12" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[16.5px] left-[33px] top-[9px] w-[309.102px]" data-name="Text">
      <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[16.5px] left-0 not-italic text-[#9ca3af] text-[11px] top-[1.5px] whitespace-nowrap">{`Start with resume optimization — it's the highest-leverage move.`}</p>
    </div>
  );
}

function DashboardCards10() {
  return (
    <div className="bg-[rgba(34,211,238,0.04)] h-[34.5px] relative rounded-[12px] shrink-0 w-full" data-name="DashboardCards">
      <div aria-hidden="true" className="absolute border border-[rgba(34,211,238,0.06)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Icon5 />
      <Text7 />
    </div>
  );
}

function Container8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] w-[999px]" data-name="Container" style={{ backgroundImage: "linear-gradient(171.041deg, rgba(4, 44, 1, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)" }}>
      <div aria-hidden="true" className="absolute border border-[rgba(34,211,238,0.08)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_0px_20px_0px_rgba(34,211,238,0.02)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <DashboardCards7 />
        <DashboardCards8 />
        <DashboardCards9 />
        <DashboardCards10 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.03)]" />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_13_987)" id="Icon">
          <path d={svgPaths.p115b3700} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M11.6667 1.75V4.08333" id="Vector_2" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M12.8333 2.91667H10.5" id="Vector_3" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M2.33333 9.91667V11.0833" id="Vector_4" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M2.91667 10.5H1.75" id="Vector_5" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_13_987">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[18px] relative shrink-0 w-[36.938px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Urbanist:Medium',sans-serif] leading-[18px] left-0 not-italic text-[#22d3ee] text-[12px] top-[-0.5px] whitespace-nowrap">Sophia</p>
      </div>
    </div>
  );
}

function DashboardCards11() {
  return (
    <div className="content-stretch flex gap-[8px] h-[18px] items-center relative shrink-0 w-full" data-name="DashboardCards">
      <Icon6 />
      <Text8 />
    </div>
  );
}

function DashboardCards12() {
  return (
    <div className="h-[21.125px] relative shrink-0 w-full" data-name="DashboardCards">
      <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[21.125px] left-0 not-italic text-[#9ca3af] text-[13px] top-[0.5px] whitespace-nowrap">{`Based on your profile, I'd start with resume optimization. Your ATS score will unlock after your first upload.`}</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] h-[81.125px] relative rounded-[16px] shrink-0 w-[999px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-start pb-px pt-[17px] px-[17px] relative size-full">
        <DashboardCards11 />
        <DashboardCards12 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[378.625px] items-start left-[60px] pl-[12px] py-[12px] top-[56px] w-[1023px]" data-name="Container">
      <DashboardCards />
      <Container8 />
      <Container15 />
    </div>
  );
}

function Container16() {
  return (
    <div className="absolute h-[24px] left-[1001.91px] top-[811px] w-[81.086px]" data-name="Container">
      <p className="absolute font-['Urbanist:Regular',sans-serif] leading-[15px] left-0 not-italic text-[#1f2937] text-[10px] top-[7.5px] tracking-[2px] whitespace-nowrap">CAREEREDGE</p>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_13_1019)" id="Icon">
          <path d={svgPaths.p115b3700} id="Vector" stroke="var(--stroke-0, #B3FF3B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M11.6667 1.75V4.08333" id="Vector_2" stroke="var(--stroke-0, #B3FF3B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M12.8333 2.91667H10.5" id="Vector_3" stroke="var(--stroke-0, #B3FF3B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M2.33333 9.91667V11.0833" id="Vector_4" stroke="var(--stroke-0, #B3FF3B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M2.91667 10.5H1.75" id="Vector_5" stroke="var(--stroke-0, #B3FF3B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_13_1019">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(179,255,59,0.12)] content-stretch flex items-center justify-center left-[11.5px] px-[7px] rounded-[12px] size-[28px] top-[12px]" data-name="Container">
      <Icon7 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3a151200} id="Vector" stroke="var(--stroke-0, #B3FF3B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1811de30} id="Vector_2" stroke="var(--stroke-0, #B3FF3B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.06)] content-stretch flex items-center justify-center left-[7.5px] px-[10px] rounded-[12px] size-[36px] top-[60px]" data-name="Container">
      <Icon8 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_13_978)" id="Icon">
          <path d={svgPaths.p29415d00} id="Vector" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p39ee6532} id="Vector_2" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_13_978">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container20() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[7.5px] opacity-40 px-[10px] rounded-[12px] size-[36px] top-[100px]" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p19416e00} id="Vector" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3e059a80} id="Vector_2" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6.66667 6H5.33333" id="Vector_3" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 8.66667H5.33333" id="Vector_4" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M10.6667 11.3333H5.33333" id="Vector_5" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[7.5px] opacity-40 px-[10px] rounded-[12px] size-[36px] top-[140px]" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p107a080} id="Vector" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 14L11.1333 11.1333" id="Vector_2" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container22() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[7.5px] opacity-40 px-[10px] rounded-[12px] size-[36px] top-[180px]" data-name="Container">
      <Icon11 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1bb15080} id="Vector" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[7.5px] opacity-40 px-[10px] rounded-[12px] size-[36px] top-[220px]" data-name="Container">
      <Icon12 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p32887f80} id="Vector" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3694d280} id="Vector_2" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f197700} id="Vector_3" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p3bf3e100} id="Vector_4" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container24() {
  return (
    <div className="absolute content-stretch flex items-center justify-center left-[7.5px] opacity-40 px-[10px] rounded-[12px] size-[36px] top-[260px]" data-name="Container">
      <Icon13 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2338cf00} id="Vector" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p28db2b80} id="Vector_2" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px opacity-35 relative rounded-[12px] w-[36px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[10px] relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function DashboardSidebar() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[7.5px] size-[36px] top-[803px]" data-name="DashboardSidebar">
      <Container25 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-gradient-to-b border-[rgba(255,255,255,0.06)] border-r border-solid from-[rgba(12,14,19,0.95)] h-[851px] left-0 to-[rgba(10,12,16,0.98)] top-0 w-[52px]" data-name="Container">
      <Container18 />
      <Container19 />
      <Container20 />
      <Container21 />
      <Container22 />
      <Container23 />
      <Container24 />
      <DashboardSidebar />
    </div>
  );
}

function Text9() {
  return (
    <div className="flex-[1_0_0] h-[19.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[0] left-0 not-italic text-[#6b7280] text-[0px] text-[13px] top-[0.5px] whitespace-nowrap">
          <span className="leading-[19.5px]">Home</span>
          <span className="leading-[19.5px] text-[#374151]">/</span>
          <span className="leading-[19.5px] text-[#9ca3af]">Product Design</span>
        </p>
      </div>
    </div>
  );
}

function DashboardTopBar() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[142.742px]" data-name="DashboardTopBar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center relative size-full">
        <Text9 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p29efa600} id="Vector" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p3042bc80} id="Vector_2" stroke="var(--stroke-0, #6B7280)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Container27() {
  return (
    <div className="bg-[rgba(255,255,255,0.04)] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[12px]" data-name="Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9px] relative size-full">
          <Icon15 />
        </div>
      </div>
    </div>
  );
}

function DashboardTopBar2() {
  return (
    <div className="content-stretch flex h-[28px] items-center justify-center relative rounded-[16777200px] shrink-0 w-full" data-name="DashboardTopBar">
      <p className="font-['Urbanist:Medium',sans-serif] leading-[15px] not-italic relative shrink-0 text-[#22d3ee] text-[10px] whitespace-nowrap">U</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-[rgba(34,211,238,0.12)] relative rounded-[16777200px] shrink-0 size-[28px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <DashboardTopBar2 />
      </div>
    </div>
  );
}

function DashboardTopBar1() {
  return (
    <div className="h-[32px] relative shrink-0 w-[68px]" data-name="DashboardTopBar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Container27 />
        <Container28 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="absolute bg-[rgba(10,12,16,0.85)] content-stretch flex h-[48px] items-center justify-between left-[52px] pb-px px-[16px] top-0 w-[1047px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.06)] border-b border-solid inset-0 pointer-events-none" />
      <DashboardTopBar />
      <DashboardTopBar1 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g clipPath="url(#clip0_13_987)" id="Icon">
          <path d={svgPaths.p115b3700} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M11.6667 1.75V4.08333" id="Vector_2" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M12.8333 2.91667H10.5" id="Vector_3" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M2.33333 9.91667V11.0833" id="Vector_4" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M2.91667 10.5H1.75" id="Vector_5" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
        <defs>
          <clipPath id="clip0_13_987">
            <rect fill="white" height="14" width="14" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function DashboardSophiaBar() {
  return (
    <div className="bg-[rgba(34,211,238,0.1)] relative rounded-[16777200px] shrink-0 size-[28px]" data-name="DashboardSophiaBar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7px] relative size-full">
        <Icon16 />
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[18px] relative shrink-0 w-[116.125px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[18px] left-0 not-italic text-[#6b7280] text-[12px] top-[0.5px] whitespace-nowrap">Ask Sophia anything...</p>
      </div>
    </div>
  );
}

function DashboardSophiaBar1() {
  return (
    <div className="bg-[rgba(255,255,255,0.03)] flex-[1_0_0] h-[32px] min-h-px min-w-px relative rounded-[12px]" data-name="DashboardSophiaBar">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[13px] pr-px py-px relative size-full">
          <Text10 />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute bg-[rgba(10,12,16,0.9)] content-stretch flex gap-[10px] h-[48px] items-center left-[52px] pt-px px-[12px] top-[803px] w-[1047px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.06)] border-solid border-t inset-0 pointer-events-none" />
      <DashboardSophiaBar />
      <DashboardSophiaBar1 />
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Urbanist:Medium',sans-serif] leading-[24px] left-0 not-italic text-[#e8e8ed] text-[16px] top-[-0.5px] whitespace-nowrap">Setting things up</p>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[19.5px] left-0 not-italic text-[#6b7280] text-[13px] top-[0.5px] whitespace-nowrap">Based on what you told me.</p>
    </div>
  );
}

function Container34() {
  return (
    <div className="absolute content-stretch flex flex-col h-[43.5px] items-start left-[52px] top-0 w-[158.031px]" data-name="Container">
      <Container35 />
      <Container36 />
    </div>
  );
}

function Container37() {
  return <div className="absolute left-[-3.73px] opacity-50 rounded-[16777200px] size-[47.45px] top-[-3.73px]" data-name="Container" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 47.45 47.45\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'1\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(0 -3.3552 -3.3553 0 23.725 23.725)\\'><stop stop-color=\\'rgba(34,211,238,0.15)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(17,106,119,0.075)\\' offset=\\'0.35\\'/><stop stop-color=\\'rgba(0,0,0,0)\\' offset=\\'0.7\\'/></radialGradient></defs></svg>')" }} />;
}

function Icon17() {
  return (
    <div className="absolute left-0 size-[40px] top-0" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g clipPath="url(#clip0_13_1044)" id="Icon">
          <g filter="url(#filter0_f_13_1044)" id="Vector">
            <path d="M20 3L37 20L20 37L3 20L20 3Z" stroke="url(#paint0_linear_13_1044)" strokeDasharray="1 1" strokeWidth="1.2" />
          </g>
          <path d={svgPaths.p1f4b7300} fill="var(--fill-0, #22D3EE)" fillOpacity="0.08" id="Vector_2" stroke="url(#paint1_linear_13_1044)" strokeWidth="0.8" />
          <path d={svgPaths.p26498700} fill="var(--fill-0, #22D3EE)" id="Vector_3" />
          <path d={svgPaths.p6ab3280} fill="var(--fill-0, #B3FF3B)" id="Vector_4" opacity="0.8" />
          <path d={svgPaths.p7a92fc0} fill="var(--fill-0, #B3FF3B)" id="Vector_5" opacity="0.8" />
          <path d={svgPaths.p8e85700} fill="var(--fill-0, #B3FF3B)" id="Vector_6" opacity="0.8" />
          <path d={svgPaths.p34c91600} fill="var(--fill-0, #B3FF3B)" id="Vector_7" opacity="0.8" />
        </g>
        <defs>
          <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="43.6971" id="filter0_f_13_1044" width="43.6971" x="-1.84853" y="-1.84853">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_13_1044" stdDeviation="2" />
          </filter>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_13_1044" x1="3" x2="3403" y1="3" y2="3403">
            <stop stopColor="#22D3EE" />
            <stop offset="1" stopColor="#B3FF3B" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_13_1044" x1="13" x2="1413" y1="13" y2="1413">
            <stop stopColor="#22D3EE" />
            <stop offset="1" stopColor="#B3FF3B" />
          </linearGradient>
          <clipPath id="clip0_13_1044">
            <rect fill="white" height="40" width="40" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SophiaMark() {
  return (
    <div className="absolute left-0 size-[40px] top-[1.75px]" data-name="SophiaMark">
      <Container37 />
      <Icon17 />
    </div>
  );
}

function BuildProcess() {
  return (
    <div className="h-[43.5px] relative shrink-0 w-[310px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container34 />
        <SophiaMark />
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-9.09%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 7.58333">
            <path d={svgPaths.p3db88f00} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="opacity-73 relative shrink-0 size-[14px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function BuildProcess2() {
  return (
    <div className="h-[14px] relative shrink-0 w-[20px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center px-[3px] relative size-full">
        <Container39 />
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[32.33%]" data-name="Vector">
        <div className="absolute inset-[-11.79%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.24003 5.24003">
            <path d={svgPaths.p5bca080} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
            <path d={svgPaths.p16fbdc80} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[12px] top-[3.75px]" data-name="Text">
      <Icon19 />
    </div>
  );
}

function BuildProcess3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[154.141px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text11 />
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[19.5px] left-[20px] not-italic text-[#9ca3af] text-[13px] top-[0.5px] whitespace-nowrap">Setting up your toolkit...</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[310px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center relative size-full">
        <BuildProcess2 />
        <BuildProcess3 />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-9.09%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 7.58333">
            <path d={svgPaths.p3db88f00} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="opacity-48 relative shrink-0 size-[14px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon20 />
      </div>
    </div>
  );
}

function BuildProcess4() {
  return (
    <div className="h-[14px] relative shrink-0 w-[20px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center px-[3px] relative size-full">
        <Container41 />
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 11">
            <path d={svgPaths.p16fbdc80} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-1/4" data-name="Vector">
        <div className="absolute inset-[-8.33%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p362cca00} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%]" data-name="Vector">
        <div className="absolute inset-[-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 3">
            <path d={svgPaths.p31427a00} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[12px] top-[3.75px]" data-name="Text">
      <Icon21 />
    </div>
  );
}

function BuildProcess5() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[250.844px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text12 />
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[19.5px] left-[20px] not-italic text-[#9ca3af] text-[13px] top-[0.5px] whitespace-nowrap">Building your Product Design roadmap...</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[310px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center relative size-full">
        <BuildProcess4 />
        <BuildProcess5 />
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-9.09%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 7.58333">
            <path d={svgPaths.p3db88f00} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="opacity-49 relative shrink-0 size-[14px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function BuildProcess6() {
  return (
    <div className="h-[14px] relative shrink-0 w-[20px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center px-[3px] relative size-full">
        <Container43 />
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_8.32%_8.33%_8.34%]" data-name="Vector">
        <div className="absolute inset-[-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.0003 11.0002">
            <path d={svgPaths.p851b100} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_16.67%_70.83%_83.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 3">
            <path d="M0.5 0.5V2.5" id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[79.17%] left-3/4 right-[8.33%] top-[20.83%]" data-name="Vector">
        <div className="absolute inset-[-0.5px_-25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 3 1">
            <path d="M2.5 0.5H0.5" id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_83.33%_20.83%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-50%_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 2">
            <path d="M0.5 0.5V1.5" id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[12.5%] right-[79.17%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.5px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 1">
            <path d="M1.5 0.5H0.5" id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[12px] top-[3.75px]" data-name="Text">
      <Icon23 />
    </div>
  );
}

function BuildProcess7() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[186.328px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text13 />
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[19.5px] left-[20px] not-italic text-[#9ca3af] text-[13px] top-[0.5px] whitespace-nowrap">Getting Sophia up to speed...</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[310px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center relative size-full">
        <BuildProcess6 />
        <BuildProcess7 />
      </div>
    </div>
  );
}

function Icon24() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-9.09%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 7.58333">
            <path d={svgPaths.p3db88f00} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="opacity-49 relative shrink-0 size-[14px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function BuildProcess8() {
  return (
    <div className="h-[14px] relative shrink-0 w-[20px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center px-[3px] relative size-full">
        <Container45 />
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
            <path d={svgPaths.p28fec000} id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-[29.17%] left-3/4 right-1/4 top-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-12.5%_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 5">
            <path d="M0.5 4.5V0.5" id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[20.83%_45.83%_29.17%_54.17%]" data-name="Vector">
        <div className="absolute inset-[-8.33%_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 7">
            <path d="M0.5 6.5V0.5" id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_66.67%_29.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-33.33%_-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 2.5">
            <path d="M0.5 2V0.5" id="Vector" stroke="var(--stroke-0, #22D3EE)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[12px] top-[3.75px]" data-name="Text">
      <Icon25 />
    </div>
  );
}

function BuildProcess9() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[212.43px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text14 />
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[19.5px] left-[20px] not-italic text-[#9ca3af] text-[13px] top-[0.5px] whitespace-nowrap">Pulling your dashboard together...</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[310px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center relative size-full">
        <BuildProcess8 />
        <BuildProcess9 />
      </div>
    </div>
  );
}

function Container47() {
  return <div className="bg-[#22d3ee] opacity-98 rounded-[16777200px] shrink-0 size-[8px]" data-name="Container" />;
}

function BuildProcess10() {
  return (
    <div className="h-[8px] relative shrink-0 w-[20px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center px-[6px] relative size-full">
        <Container47 />
      </div>
    </div>
  );
}

function Icon26() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-[29.17%] left-[16.67%] right-[16.67%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-9.09%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 6.5">
            <path d="M8.5 0.5L3 6L0.5 3.5" id="Vector" stroke="var(--stroke-0, #374151)" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 size-[12px] top-[3.75px]" data-name="Text">
      <Icon26 />
    </div>
  );
}

function BuildProcess11() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[57.016px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Text15 />
        <p className="absolute font-['Satoshi:Regular',sans-serif] leading-[19.5px] left-[20px] not-italic text-[#9ca3af] text-[13px] top-[0.5px] whitespace-nowrap">All set.</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[310px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center relative size-full">
        <BuildProcess10 />
        <BuildProcess11 />
      </div>
    </div>
  );
}

function BuildProcess1() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[310px]" data-name="BuildProcess">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[12px] items-start relative size-full">
        <Container38 />
        <Container40 />
        <Container42 />
        <Container44 />
        <Container46 />
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[213px] items-start relative shrink-0 w-full" data-name="Container">
      <BuildProcess />
      <BuildProcess1 />
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-[rgba(12,14,19,0.85)] flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] w-[360px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.06)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_40px_0px_rgba(0,0,0,0.4)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start pb-px pt-[25px] px-[25px] relative size-full">
        <Container33 />
      </div>
      <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.03)]" />
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[263px] relative shrink-0 w-[360px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container32 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="absolute content-stretch flex h-[851px] items-center left-0 pl-[68px] top-0 w-[1099px]" data-name="Container">
      <Container31 />
    </div>
  );
}

function OnboardingH() {
  return (
    <div className="absolute bg-[#08090c] h-[851px] left-0 overflow-clip top-0 w-[1099px]" data-name="OnboardingH2">
      <Container />
      <Container1 />
      <Container16 />
      <Container17 />
      <Container26 />
      <Container29 />
      <Container30 />
    </div>
  );
}

function Text17() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[11.008px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Medium',sans-serif] leading-[18px] left-[6px] not-italic text-[#6b7280] text-[12px] text-center top-[-0.5px] whitespace-nowrap">H1</p>
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="h-[15px] relative shrink-0 w-[91.258px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Medium',sans-serif] leading-[15px] left-[46px] not-italic text-[#6b7280] text-[10px] text-center top-[0.5px] whitespace-nowrap">The World Opens Up</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] h-[35px] items-center relative shrink-0 w-full" data-name="Text">
      <Text17 />
      <Text18 />
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col h-[51px] items-start left-[4px] pt-[8px] px-[12px] rounded-[12px] top-[4px] w-[115.258px]" data-name="Button">
      <Text16 />
    </div>
  );
}

function Container49() {
  return <div className="absolute bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] border-solid h-[51px] left-0 rounded-[12px] top-0 w-[138.336px]" data-name="Container" />;
}

function Text20() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[14.242px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Medium',sans-serif] leading-[18px] left-[7.5px] not-italic text-[#e8e8ed] text-[12px] text-center top-[-0.5px] whitespace-nowrap">H2</p>
      </div>
    </div>
  );
}

function Text21() {
  return (
    <div className="h-[15px] relative shrink-0 w-[114.336px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Medium',sans-serif] leading-[15px] left-[57.5px] not-italic text-[#6b7280] text-[10px] text-center top-[0.5px] whitespace-nowrap">Product Builds Around You</p>
      </div>
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[35px] items-center left-[12px] top-[8px] w-[114.336px]" data-name="Text">
      <Text20 />
      <Text21 />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute h-[51px] left-[123.26px] rounded-[12px] top-[4px] w-[138.336px]" data-name="Button">
      <Container49 />
      <Text19 />
    </div>
  );
}

function Text23() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[13.578px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Medium',sans-serif] leading-[18px] left-[7px] not-italic text-[#6b7280] text-[12px] text-center top-[-0.5px] whitespace-nowrap">H3</p>
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="h-[15px] relative shrink-0 w-[86.078px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Urbanist:Medium',sans-serif] leading-[15px] left-[43.5px] not-italic text-[#6b7280] text-[10px] text-center top-[0.5px] whitespace-nowrap">Sophia Speaks First</p>
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] h-[35px] items-center relative shrink-0 w-full" data-name="Text">
      <Text23 />
      <Text24 />
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[51px] items-start left-[265.59px] pt-[8px] px-[12px] rounded-[12px] top-[4px] w-[110.078px]" data-name="Button">
      <Text22 />
    </div>
  );
}

function Container48() {
  return (
    <div className="absolute bg-[rgba(10,12,16,0.8)] border border-[rgba(255,255,255,0.06)] border-solid h-[61px] left-[701.33px] rounded-[16px] top-[16px] w-[381.672px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
    </div>
  );
}

export default function UiUxOverhaulProject() {
  return (
    <div className="bg-[#08090c] relative size-full" data-name="UI/UX Overhaul Project">
      <OnboardingH />
      <Container48 />
    </div>
  );
}