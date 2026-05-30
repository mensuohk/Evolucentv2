export type CompletedImpactProject = {
  id: string;
  title: string;
  region: string;
  category: string;
  description: string;
  amountRaised: number;
  targetAmount: number;
  supporters: number;
  completedDate: string;
  auditor: string;
  beforeImage: string;
  afterImage: string;
  impact: string;
};

export const COMPLETED_IMPACT_PROJECTS: CompletedImpactProject[] = [
  {
    id: "proj-tamale-it",
    title: "Tamale Community IT Centre Renovation",
    region: "Northern Region",
    category: "Education",
    description:
      "Full renovation of the Tamale Zogbeli IT centre — replacing all computers, fixing the roof, and installing reliable solar power backup for uninterrupted learning.",
    amountRaised: 20_000,
    targetAmount: 20_000,
    supporters: 420,
    completedDate: "January 2026",
    auditor: "KPMG Ghana",
    beforeImage: "/images/impact/impact-tamale-it-before.png",
    afterImage: "/images/impact/impact-tamale-it-after.png",
    impact:
      "340 students now have access to working computers and internet for the first time.",
  },
  {
    id: "c2",
    title: "Kumasi Suame Road Resurfacing",
    region: "Ashanti Region",
    category: "Roads",
    description:
      "Resurfaced 1.2km of the Suame Magazine access road, improving daily movement for over 22,000 traders and residents.",
    amountRaised: 55_000,
    targetAmount: 55_000,
    supporters: 1840,
    completedDate: "December 2025",
    auditor: "Deloitte Ghana",
    beforeImage: "/images/impact/impact-kumasi-road-before.png",
    afterImage: "/images/impact/impact-kumasi-road-after.png",
    impact:
      "22,000 daily users. Truck delivery times cut by 40%. Zero flood disruptions this rainy season.",
  },
  {
    id: "c3",
    title: "Accra Korle-Bu Borehole Project",
    region: "Greater Accra",
    category: "Water",
    description:
      "Installed a solar-powered borehole serving 3 communities in the Korle-Bu catchment area, providing clean water to 4,200 residents.",
    amountRaised: 38_000,
    targetAmount: 38_000,
    supporters: 980,
    completedDate: "November 2025",
    auditor: "PwC Ghana",
    beforeImage: "/images/impact/impact-korlebu-water-before.png",
    afterImage: "/images/impact/impact-korlebu-water-after.png",
    impact:
      "4,200 residents now have clean water access. Waterborne disease cases down 60% in Q4 2025.",
  },
];
