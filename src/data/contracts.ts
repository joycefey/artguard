export interface EscrowContract {
  id: string;
  counterparty: string;
  amount: number;
  status: "Waiting" | "In Progress" | "Reviewing" | "Disputed";
  projectName: string;
  description: string;
  deadline: string;
  createdAt: string;
}

export const mockContracts: EscrowContract[] = [
  {
    id: "ESC-0x4A1",
    counterparty: "0xAB...F2",
    amount: 2500,
    status: "Reviewing",
    projectName: "Website Redesign",
    description: "Complete redesign of corporate website with responsive layout and new brand identity.",
    deadline: "2026-03-15",
    createdAt: "2026-02-10",
  },
  {
    id: "ESC-0x7B3",
    counterparty: "0xCD...89",
    amount: 800,
    status: "In Progress",
    projectName: "Logo Design",
    description: "Modern logo design with 3 revision rounds included.",
    deadline: "2026-03-01",
    createdAt: "2026-02-18",
  },
  {
    id: "ESC-0x9E5",
    counterparty: "0xEF...11",
    amount: 12000,
    status: "Disputed",
    projectName: "Smart Contract Audit",
    description: "Full security audit of DeFi protocol smart contracts.",
    deadline: "2026-02-28",
    createdAt: "2026-02-05",
  },
  {
    id: "ESC-0x2C8",
    counterparty: "0x34...A7",
    amount: 500,
    status: "Waiting",
    projectName: "Content Writing",
    description: "10 blog posts on Web3 topics, 1500 words each.",
    deadline: "2026-04-01",
    createdAt: "2026-02-20",
  },
];
