# 🌍 DappTrack - Blockchain Transparency Platform for Public Funds

[![Aptos](https://img.shields.io/badge/Aptos-Testnet-blue)](https://aptos.dev)
[![React](https://img.shields.io/badge/React-18-61dafb)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-Apache%202.0-green)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://dapptrack.appwrite.network/)

**DappTrack** is a blockchain-based transparency platform built on Aptos that enables governments, NGOs, and public organizations to track donations, manage funds, and provide public accountability for all expenses with immutable proof storage on IPFS.

## 🎯 Problem Statement

Public funds, NGO budgets, and donations often move through systems that are completely opaque and easy to manipulate. Receipts can be forged, photos of "completed work" can be reused or edited, and financial reports can be changed after the fact without leaving a trace. As a result, donors, auditors, and citizens have no reliable way to verify whether money actually reached the intended beneficiaries or if field work was genuinely completed.

This lack of transparency leads to fund leakage, misallocation, and widespread mistrust in public programs, especially in developing regions where manual reporting and offline processes dominate. In short, **the flow of public funds is broken by a crisis of authenticity — because nothing is truly verifiable.**

## 💡 Our Solution

DappTrack solves this crisis by leveraging blockchain technology and decentralized storage to create an **immutable, transparent, and publicly auditable** system for tracking public funds from donation to delivery.

## ✨ Features

### 🎯 Core Functionality
- **Track Donations** - Monitor all donations with organization and project-level filtering
- **Make Donations** - Donate APT to specific projects within organizations
- **Verify Expenses** - Public transparency with IPFS-backed expense proofs
- **Project Delivery** - Track project status and completion
- **Audit Trail** - Complete timeline of all donations and expenses
- **User Guide** - Comprehensive documentation for all user types

### 🔐 Blockchain Features
- **Aptos Smart Contracts** - Immutable transaction records on Aptos blockchain
- **Wallet Integration** - Support for Petra, Pontem, and Martian wallets
- **IPFS Storage** - Decentralized proof document storage via Pinata
- **Public Verification** - Anyone can audit expenses without wallet connection
- **Real-time Updates** - Auto-refresh for latest blockchain data

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Aptos wallet (Petra recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/mdsaad31/DappTrack.git
cd DappTrack/dapptrack
```

2. **Install dependencies**
```bash
npm install
cd backend && npm install && cd ..
```

3. **Configure environment**
```bash
# Create .env file with required variables
# See DEPLOYMENT_GUIDE.md for details
```

4. **Start development servers**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend && npm start
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📁 Project Structure

```
dapptrack/
├── frontend/              # React frontend
│   ├── pages/            # Application pages
│   ├── components/       # UI components
│   ├── entry-functions/  # Blockchain writes
│   └── view-functions/   # Blockchain reads
├── backend/              # Express API
│   └── server.js         # API + IPFS
├── contract/             # Move contracts
│   └── sources/          # Smart contracts
└── public/               # Static assets
```

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────────┐  │
│  │  Track   │  Donate  │  Verify  │  Deliver │  Audit       │  │
│  │  Page    │  Page    │  Page    │  Page    │  Trail       │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────────┘  │
│           │                    │                    │            │
│           ▼                    ▼                    ▼            │
│  ┌────────────────────────────────────────────────────────┐     │
│  │         Wallet Provider (Petra/Pontem/Martian)         │     │
│  └────────────────────────────────────────────────────────┘     │
└───────────────────────┬─────────────────────┬───────────────────┘
                        │                     │
                        ▼                     ▼
        ┌───────────────────────┐   ┌──────────────────────┐
        │   Aptos Blockchain    │   │  Backend API         │
        │   (Testnet)           │   │  (Express + IPFS)    │
        │                       │   │                      │
        │  ┌─────────────────┐  │   │  ┌────────────────┐ │
        │  │ Smart Contracts │  │   │  │ Pinata Gateway │ │
        │  │  - dapptrack    │  │   │  │ IPFS Storage   │ │
        │  │  - dapptrack_v2 │  │   │  └────────────────┘ │
        │  └─────────────────┘  │   └──────────────────────┘
        │                       │
        │  Events:              │
        │  • DonationReceived   │
        │  • FundAllocated      │
        │  • ExpenseRecorded    │
        └───────────────────────┘
```

### Data Flow Architecture

**1. Donation Flow:**
```
User → Wallet → Smart Contract → DonationReceived Event → Frontend Update
                       ↓
                 Organization Balance Updated
                       ↓
                 Project Funding Recorded
```

**2. Expense Recording Flow:**
```
Organization → Upload Proof → Backend API → Pinata IPFS
                                    ↓
                            Get IPFS Hash (CID)
                                    ↓
              Smart Contract ← IPFS Hash ← Backend
                     ↓
            ExpenseRecorded Event
                     ↓
              Blockchain Storage + Public Verification
```

**3. Public Audit Flow:**
```
Citizen/Auditor → Track/Verify Page → Query Blockchain
                                           ↓
                                   Get All Expenses
                                           ↓
                                   Fetch IPFS Proofs
                                           ↓
                                   Display with Links
```

## 🔧 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Wallet Integration:** Aptos Wallet Adapter
- **State Management:** React Hooks
- **Routing:** React Router DOM

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Blockchain SDK:** @aptos-labs/ts-sdk 5.0+
- **IPFS Integration:** Pinata Web3 SDK
- **File Upload:** Multer
- **CORS:** cors middleware

### Blockchain
- **Network:** Aptos Testnet
- **Language:** Move
- **Contract Version:** dapptrack_v2
- **Address:** `0x80ab1ccee8fbcfdbd54e0efe1643a41617b4cf7ca7659be6dc0169d2dddf275b`

### Storage & Hosting
- **Decentralized Storage:** IPFS via Pinata
- **Frontend Hosting:** Appwrite Static Sites
- **Backend Hosting:** Appwrite Cloud Functions (Node.js 18)
- **Region:** Frankfurt (eu-central)
- **CDN:** Appwrite Global CDN

### Development Tools
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Linting:** ESLint
- **TypeScript:** 5.2+
- **API Testing:** cURL, Postman

## 🗂️ System Components

### Smart Contracts (Move)
```move
module dapptrack {
    struct Organization
    struct Project
    struct Donation
    struct Expense
    
    entry functions:
    - register_organization()
    - create_project()
    - donate_to_organization()
    - allocate_funds()
    - record_expense()
}
```

### Frontend Pages
1. **Track Page** - Monitor donations & expenses with real-time stats
2. **Donate Page** - Make donations to specific projects
3. **Verify Page** - Public expense verification with IPFS proofs
4. **Deliver Page** - Track project status and deliverables
5. **Audit Page** - Complete timeline of all transactions
6. **User Guide** - Documentation for donors, organizations, auditors

### Backend API Endpoints
```
GET  /health                 - Health check
GET  /organizations          - List all organizations
POST /organizations          - Register new organization
POST /upload-proof           - Upload expense proof to IPFS
GET  /events/donations       - Query donation events
GET  /events/funds           - Query fund allocation events
```

### Database Schema (On-Chain)
- **Organizations Table:** Stores org metadata
- **Projects Table:** Links projects to organizations
- **Donations Table:** Records all donations with amounts
- **Expenses Table:** Records expenses with IPFS proof links
- **Events:** DonationReceived, FundAllocated, ExpenseRecorded

## 📦 Smart Contract

**Deployed on Aptos Testnet:**  
`0x80ab1ccee8fbcfdbd54e0efe1643a41617b4cf7ca7659be6dc0169d2dddf275b`

[View on Explorer](https://explorer.aptoslabs.com/account/0x80ab1ccee8fbcfdbd54e0efe1643a41617b4cf7ca7659be6dc0169d2dddf275b?network=testnet)

## 🌐 Live Deployment

### Production URLs
- **Frontend:** https://dapptrack.appwrite.network/
- **Backend API:** https://692bd4b700399555dd56.fra.appwrite.run
- **Smart Contract:** [View on Explorer](https://explorer.aptoslabs.com/account/0x80ab1ccee8fbcfdbd54e0efe1643a41617b4cf7ca7659be6dc0169d2dddf275b?network=testnet)

### Deployment Architecture
```
GitHub Repository (main branch)
        ↓
Appwrite Cloud (Frankfurt)
        ↓
    ┌───┴───┐
    ↓       ↓
Frontend   Backend
(Static)   (Cloud Function)
    ↓       ↓
  CDN    Node.js Runtime
```

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Appwrite:** Auto-deploy from GitHub (current setup)
- **Vercel:** `vercel --prod`
- **Netlify:** `netlify deploy --prod --dir=dist`

See [APPWRITE_DEPLOYMENT.md](APPWRITE_DEPLOYMENT.md) for complete instructions.

## 🔐 Security Features

- **Immutable Records:** All transactions stored on blockchain
- **Wallet Authentication:** Secure wallet-based access
- **IPFS Content Addressing:** Tamper-proof document storage
- **Public Verification:** Anyone can audit without credentials
- **Smart Contract Validation:** On-chain verification of all operations
- **Environment Variables:** Sensitive data stored securely in Appwrite

## 📊 Key Metrics

- **Transaction Speed:** ~1-2 seconds on Aptos
- **Storage:** Decentralized via IPFS (permanent)
- **Cost:** Minimal gas fees on Aptos Testnet
- **Scalability:** Supports unlimited organizations & projects
- **Uptime:** 99.9% (Appwrite SLA)
- **Global Access:** CDN-distributed frontend

## 🎓 Use Cases

### For Governments
- Track public fund allocation in real-time
- Provide transparent reporting to citizens
- Reduce corruption and fund leakage
- Comply with audit requirements automatically

### For NGOs
- Build donor trust with transparent operations
- Automate donation tracking and reporting
- Prove fund utilization with immutable records
- Attract more donors through accountability

### For Donors
- See exactly where donations go
- Verify project completion with IPFS proofs
- Track impact of contributions in real-time
- Ensure funds reach intended beneficiaries

### For Auditors & Citizens
- Audit any organization without special access
- Verify expense proofs independently
- Track complete transaction history
- Ensure public accountability

## 🚧 Roadmap

- [x] Core donation tracking system
- [x] IPFS proof storage integration
- [x] Public verification interface
- [x] Multi-wallet support
- [x] Production deployment on Appwrite
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard
- [ ] Organization reputation scoring
- [ ] Email notifications for donors
- [ ] Mainnet deployment

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Apache 2.0 License - see [LICENSE](LICENSE)

## 🔗 Links

- **Live Demo:** https://dapptrack.appwrite.network/
- **API Documentation:** [APPWRITE_DEPLOYMENT.md](APPWRITE_DEPLOYMENT.md)
- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Aptos Docs:** https://aptos.dev
- **Aptos Explorer:** https://explorer.aptoslabs.com

## 👥 Team

Built with ❤️ for transparent public fund management

## 📧 Contact

- **GitHub:** [@mdsaad31](https://github.com/mdsaad31)
- **Repository:** [DappTrack](https://github.com/mdsaad31/DappTrack)

---

**⭐ Star this repo if you find it helpful!**

**Built with Aptos blockchain 🚀 | Hosted on Appwrite ⚡ | Stored on IPFS 📦**
