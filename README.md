# ArtGuard 🎨 
**Decentralized Art Commission & Dispute Resolution Platform**

> Built for Avalanche Build Games 2026 🔺

## 📖 Introduction
ArtGuard is a trustless, decentralized platform designed to protect both commissioners (buyers) and artists in the digital art commission space. By leveraging smart contracts on the Avalanche network, ArtGuard ensures that funds are securely locked during the creative process and introduces a unique, community-driven "Small Court" system to fairly resolve disputes (such as AI-generation suspicions).

## 💡 The Problem
In traditional online art commissions, trust is a major issue. Buyers fear paying upfront and receiving low-quality or AI-generated work, while artists fear putting in hours of effort only to be ghosted without payment. Centralized platforms often charge high fees and lack a transparent dispute resolution mechanism.

## ⚙️ How It Works (Core Architecture)
The platform ecosystem is built around **3 distinct roles**, each interacting via their Web3 wallets:

### 1. The Commissioner (Buyer)
* He connects his wallet and creates a new commission order.
* He inputs specific requirements (Title, Deadline, Description, Reference Images) and designates a specific artist's wallet address.
* **Smart Contract Action:** The payment is deposited and securely locked in the ArtGuard escrow contract.

### 2. The Artist (Painter)
* He receives the targeted commission, completes the artwork, and uploads it to the platform.
* **Happy Path:** If the commissioner is satisfied, he clicks "Release Funds", and the smart contract instantly transfers the locked payment to the artist.

### 3. The Judge (The "Small Court")
* **Dispute Scenario:** If the commissioner is unsatisfied, the funds remain locked, and the case enters the "Small Court".
* The artist can either acknowledge the fault (refunding the buyer) or raise an objection by uploading proof of originality (e.g., drawing layers).
* **On-Chain Resolution:** Whitelisted, impartial judges review the evidence and cast their votes. The voting result is signed on-chain, triggering the smart contract to release the funds to the winning party. *(Note: To ensure fairness, neither the buyer nor the artist involved can act as a judge).*

## 🛠️ Tech Stack
* **Blockchain:** Avalanche 
* **Smart Contracts:** Solidity
* **Frontend:** React + Vite + Tailwind CSS
* **Wallet Integration:** MetaMask + Ethers.js

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js (v16+)
* Git
* MetaMask Wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joycefey/artguard
cd ArtGuard
```
2. Install dependencies for the frontend:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
Smart Contract Deployment:
The Solidity contracts are located in the /contracts folder.

Deployed Contract Address on Avalanche Testnet: 0xC9fecf9a5b67d0D3B4067504DB29CbAe02c91e01

🗺️ Future Roadmap
DeFi Integration (AUSD Yield Pool): In the future, the locked AUSD during the commission process will be safely routed to a yield-bearing pool to generate interest. This mechanism will maximize capital efficiency and create an additional revenue stream for the platform and its users.

Generation 2 Judge System: Transitioning from an invite-only whitelist to an application-based system where qualified artists can submit portfolios to be reviewed by Gen-1 judges.

Multi-Judge Panel: Expanding from a single-judge demo to an odd-number multi-judge system for enhanced decentralization and fairness.

👥 Team
[JOYCE/ELODIE] - LEGAL WORKER / AI ENGINEER

This project was created for the Avalanche Build Games 2026 Hackathon.
