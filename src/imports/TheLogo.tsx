import svgPaths from "./svg-hvb86fdkju";

function Group() {
  return (
    <div className="absolute inset-[3.27%_76%_8.77%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69.0803 93.3029">
        <g id="Group">
          <g id="Group_2">
            <path d={svgPaths.p16bdf500} fill="var(--fill-0, #14A9FF)" id="Vector" />
            <path d={svgPaths.p3156c400} fill="var(--fill-0, #14A9FF)" id="Vector_2" />
          </g>
          <path d={svgPaths.p4a7ab00} fill="var(--fill-0, #14A9FF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[9.97%_12.44%_6.2%_31.86%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 160.354 88.9338">
        <g id="Group">
          <path d={svgPaths.pe7b1e80} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.pcae2af0} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p22d3c80} fill="var(--fill-0, black)" id="Vector_3" />
          <path d={svgPaths.pe4f180} fill="var(--fill-0, black)" id="Vector_4" />
          <path d={svgPaths.pd110400} fill="var(--fill-0, black)" id="Vector_5" />
          <path d={svgPaths.p28da3b00} fill="var(--fill-0, black)" id="Vector_6" />
          <path d={svgPaths.p29d17100} fill="var(--fill-0, black)" id="Vector_7" />
          <path d={svgPaths.p19252970} fill="var(--fill-0, black)" id="Vector_8" />
          <path d={svgPaths.p18f00d00} fill="var(--fill-0, black)" id="Vector_9" />
          <path d={svgPaths.p298e0880} fill="var(--fill-0, black)" id="Vector_10" />
          <path d={svgPaths.p37193470} fill="var(--fill-0, black)" id="Vector_11" />
        </g>
      </svg>
    </div>
  );
}

function Layer() {
  return (
    <div className="absolute h-[106.078px] left-[287.07px] overflow-clip top-[101.46px] w-[287.853px]" data-name="Layer_1">
      <Group />
      <Group1 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[287.07px] top-[101.46px]">
      <Layer />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[16px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Group9 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#06b6d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[3.27%_76%_8.77%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69.0803 93.3029">
        <g id="Group">
          <g id="Group_2">
            <path d={svgPaths.p16bdf500} fill="var(--fill-0, white)" id="Vector" />
            <path d={svgPaths.p3156c400} fill="var(--fill-0, white)" id="Vector_2" />
          </g>
          <path d={svgPaths.p4a7ab00} fill="var(--fill-0, white)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[9.97%_12.44%_6.2%_31.86%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 160.354 88.9338">
        <g id="Group">
          <path d={svgPaths.pe7b1e80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pcae2af0} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p22d3c80} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.pe4f180} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.pd110400} fill="var(--fill-0, white)" id="Vector_5" />
          <path d={svgPaths.p28da3b00} fill="var(--fill-0, white)" id="Vector_6" />
          <path d={svgPaths.p29d17100} fill="var(--fill-0, white)" id="Vector_7" />
          <path d={svgPaths.p19252970} fill="var(--fill-0, white)" id="Vector_8" />
          <path d={svgPaths.p18f00d00} fill="var(--fill-0, white)" id="Vector_9" />
          <path d={svgPaths.p298e0880} fill="var(--fill-0, white)" id="Vector_10" />
          <path d={svgPaths.p37193470} fill="var(--fill-0, white)" id="Vector_11" />
        </g>
      </svg>
    </div>
  );
}

function Layer1() {
  return (
    <div className="absolute h-[106.078px] left-[287.07px] overflow-clip top-[101.46px] w-[287.853px]" data-name="Layer_1">
      <Group2 />
      <Group3 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[287.07px] top-[101.46px]">
      <Layer1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#14a9ff] flex-[1_0_0] h-full min-h-px min-w-px overflow-clip relative rounded-[16px]">
      <Group10 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[38px] h-[307px] items-center relative shrink-0 w-full">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[3.27%_76%_8.77%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69.0803 93.3029">
        <g id="Group">
          <g id="Group_2">
            <path d={svgPaths.p16bdf500} fill="var(--fill-0, black)" id="Vector" />
            <path d={svgPaths.p3156c400} fill="var(--fill-0, black)" id="Vector_2" />
          </g>
          <path d={svgPaths.p4a7ab00} fill="var(--fill-0, black)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[9.97%_12.44%_6.2%_31.86%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 160.354 88.9338">
        <g id="Group">
          <path d={svgPaths.pe7b1e80} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.pcae2af0} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p22d3c80} fill="var(--fill-0, black)" id="Vector_3" />
          <path d={svgPaths.pe4f180} fill="var(--fill-0, black)" id="Vector_4" />
          <path d={svgPaths.pd110400} fill="var(--fill-0, black)" id="Vector_5" />
          <path d={svgPaths.p28da3b00} fill="var(--fill-0, black)" id="Vector_6" />
          <path d={svgPaths.p29d17100} fill="var(--fill-0, black)" id="Vector_7" />
          <path d={svgPaths.p19252970} fill="var(--fill-0, black)" id="Vector_8" />
          <path d={svgPaths.p18f00d00} fill="var(--fill-0, black)" id="Vector_9" />
          <path d={svgPaths.p298e0880} fill="var(--fill-0, black)" id="Vector_10" />
          <path d={svgPaths.p37193470} fill="var(--fill-0, black)" id="Vector_11" />
        </g>
      </svg>
    </div>
  );
}

function Layer2() {
  return (
    <div className="absolute h-[106.078px] left-[287.07px] overflow-clip top-[101.46px] w-[287.853px]" data-name="Layer_1">
      <Group4 />
      <Group5 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[287.07px] top-[101.46px]">
      <Layer2 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#b3ff3b] flex-[1_0_0] h-full min-h-px min-w-px overflow-clip relative rounded-[16px]">
      <Group11 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute inset-[3.27%_76%_8.77%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69.0803 93.3029">
        <g id="Group">
          <g id="Group_2">
            <path d={svgPaths.p16bdf500} fill="var(--fill-0, #22D3EE)" id="Vector" />
            <path d={svgPaths.p3156c400} fill="var(--fill-0, #22D3EE)" id="Vector_2" />
          </g>
          <path d={svgPaths.p4a7ab00} fill="var(--fill-0, #22D3EE)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute inset-[9.97%_12.44%_6.2%_31.86%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 160.354 88.9338">
        <g id="Group">
          <path d={svgPaths.pe7b1e80} fill="var(--fill-0, white)" id="Vector" />
          <path d={svgPaths.pcae2af0} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p22d3c80} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.pe4f180} fill="var(--fill-0, white)" id="Vector_4" />
          <path d={svgPaths.pd110400} fill="var(--fill-0, white)" id="Vector_5" />
          <path d={svgPaths.p28da3b00} fill="var(--fill-0, white)" id="Vector_6" />
          <path d={svgPaths.p29d17100} fill="var(--fill-0, white)" id="Vector_7" />
          <path d={svgPaths.p19252970} fill="var(--fill-0, white)" id="Vector_8" />
          <path d={svgPaths.p18f00d00} fill="var(--fill-0, white)" id="Vector_9" />
          <path d={svgPaths.p298e0880} fill="var(--fill-0, white)" id="Vector_10" />
          <path d={svgPaths.p37193470} fill="var(--fill-0, white)" id="Vector_11" />
        </g>
      </svg>
    </div>
  );
}

function Layer3() {
  return (
    <div className="absolute h-[106.078px] left-[287.07px] overflow-clip top-[101.46px] w-[287.853px]" data-name="Layer_1">
      <Group6 />
      <Group7 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[287.07px] top-[101.46px]">
      <Layer3 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#5025fe] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[16px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <Group8 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#06b6d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[38px] h-[307px] items-center relative shrink-0 w-full">
      <Frame5 />
      <Frame6 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[46px] items-start left-[80px] top-[340px] w-[1760px]">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

export default function TheLogo() {
  return (
    <div className="bg-white relative size-full" data-name="The Logo">
      <p className="absolute font-['Schibsted_Grotesk:SemiBold',sans-serif] font-semibold leading-none left-[152px] text-[#0f172a] text-[120px] top-[80px] tracking-[-4.8px] whitespace-nowrap">The Logo</p>
      <p className="absolute font-['Geist:Medium',sans-serif] leading-none left-[80px] not-italic text-[#0f172a] text-[32px] top-[94px] tracking-[-1.28px] w-[59px]">01</p>
      <Frame4 />
    </div>
  );
}