# 🏗️ DappTrack System Architecture

## Table of Contents
- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Component Diagrams](#component-diagrams)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)

## Overview

DappTrack is a decentralized application (dApp) built on the Aptos blockchain that provides transparent tracking of public funds, donations, and expenses with immutable proof storage on IPFS.

### Core Principles
1. **Transparency First:** All transactions are publicly auditable
2. **Immutability:** Blockchain ensures records cannot be altered
3. **Decentralization:** IPFS storage prevents single point of failure
4. **Accessibility:** No authentication required for public verification

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              End Users                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Donors     │  │     NGOs     │  │  Government  │  │  Auditors  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Presentation Layer                              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │              React Frontend (TypeScript + Vite)                   │  │
│  │  ┌────────┬────────┬────────┬─────────┬──────────┬────────────┐  │  │
│  │  │ Track  │ Donate │ Verify │ Deliver │  Audit   │ User Guide │  │  │
│  │  │  Page  │  Page  │  Page  │  Page   │   Page   │    Page    │  │  │
│  │  └────────┴────────┴────────┴─────────┴──────────┴────────────┘  │  │
│  │                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │        Wallet Adapter (Petra, Pontem, Martian)              │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Hosted on: Appwrite Static Sites (Frankfurt)                          │
│  CDN: Appwrite Global CDN                                               │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
┌──────────────────────────────────┐  ┌──────────────────────────────┐
│      Blockchain Layer            │  │     Storage Layer            │
│   (Aptos Testnet)                │  │   (Backend API + IPFS)       │
│                                  │  │                              │
│  ┌────────────────────────────┐  │  │  ┌────────────────────────┐  │
│  │   Smart Contracts (Move)   │  │  │  │  Express.js Server     │  │
│  │                            │  │  │  │  (Appwrite Function)   │  │
│  │  • dapptrack_v2.move       │  │  │  │                        │  │
│  │  • Organization Registry   │  │  │  │  • File Upload API     │  │
│  │  • Project Management      │  │  │  │  • Organization API    │  │
│  │  • Donation Tracking       │  │  │  │  • Event Query API     │  │
│  │  • Expense Recording       │  │  │  └────────────────────────┘  │
│  └────────────────────────────┘  │  │              ↓               │
│               ↓                  │  │  ┌────────────────────────┐  │
│  ┌────────────────────────────┐  │  │  │    Pinata IPFS         │  │
│  │   Event Emitters           │  │  │  │                        │  │
│  │  • DonationReceived        │  │  │  │  • Document Storage    │  │
│  │  • FundAllocated           │  │  │  │  • Content Addressing  │  │
│  │  • ExpenseRecorded         │  │  │  │  • Gateway Access      │  │
│  └────────────────────────────┘  │  │  └────────────────────────┘  │
│                                  │  │                              │
│  Contract Address:               │  │  Hosted on:                  │
│  0x80ab1ccee8f...dddf275b        │  │  Appwrite Cloud Functions    │
└──────────────────────────────────┘  └──────────────────────────────┘
```

## Component Diagrams

### Frontend Components

```
frontend/
├── pages/
│   ├── TrackPage.tsx          # Dashboard with donation/expense tracking
│   ├── DonatePage.tsx         # Donation interface with wallet integration
│   ├── ExpenseVerificationPage.tsx  # Public verification interface
│   ├── DeliverPage.tsx        # Project delivery tracking
│   ├── AuditPage.tsx          # Complete transaction timeline
│   └── UserGuidePage.tsx      # Documentation and guides
│
├── components/
│   ├── Header.tsx             # Navigation and wallet connection
│   ├── WalletProvider.tsx     # Wallet context management
│   ├── WalletSelector.tsx     # Multi-wallet support
│   ├── NetworkInfo.tsx        # Network status display
│   └── ui/                    # shadcn/ui components
│
├── entry-functions/           # Blockchain write operations
│   ├── writeMessage.ts        # Example write function
│   └── transferAPT.ts         # Token transfer
│
├── view-functions/            # Blockchain read operations
│   ├── getAccountBalance.ts   # Query balances
│   └── getMessageContent.ts   # Read blockchain data
│
└── utils/
    ├── aptosClient.ts         # Aptos SDK configuration
    └── helpers.ts             # Utility functions
```

### Backend Components

```
backend/
├── server.js                  # Express server
│   ├── CORS middleware
│   ├── JSON parser
│   ├── File upload (Multer)
│   └── Route handlers
│
├── Routes:
│   ├── GET  /health          # Health check
│   ├── GET  /organizations   # List all orgs
│   ├── POST /organizations   # Register org
│   ├── POST /upload-proof    # Upload to IPFS
│   ├── GET  /events/donations # Query donations
│   └── GET  /events/funds    # Query fund allocations
│
└── Integrations:
    ├── Aptos SDK             # Blockchain queries
    └── Pinata SDK            # IPFS operations
```

### Smart Contract Structure

```
contract/sources/dapptrack_v2.move

module dapptrack {
    // Structs
    struct Organization {
        name: String,
        wallet_address: address,
        total_donated: u64,
        total_allocated: u64,
        active: bool
    }
    
    struct Project {
        id: u64,
        organization_id: u64,
        name: String,
        target_amount: u64,
        raised_amount: u64,
        status: u8  // 0=Active, 1=Completed, 2=Cancelled
    }
    
    struct Donation {
        donor: address,
        organization_id: u64,
        project_id: u64,
        amount: u64,
        timestamp: u64
    }
    
    struct Expense {
        organization_id: u64,
        project_id: u64,
        amount: u64,
        description: String,
        ipfs_hash: String,  // Proof document on IPFS
        timestamp: u64
    }
    
    // Entry Functions
    public entry fun register_organization(
        account: &signer,
        name: String
    )
    
    public entry fun create_project(
        account: &signer,
        org_id: u64,
        name: String,
        target: u64
    )
    
    public entry fun donate_to_organization(
        donor: &signer,
        org_id: u64,
        project_id: u64,
        amount: u64
    )
    
    public entry fun record_expense(
        account: &signer,
        org_id: u64,
        project_id: u64,
        amount: u64,
        description: String,
        ipfs_hash: String
    )
    
    // Events
    struct DonationReceived has drop, store {
        donor: address,
        organization_id: u64,
        project_id: u64,
        amount: u64
    }
    
    struct ExpenseRecorded has drop, store {
        organization_id: u64,
        project_id: u64,
        amount: u64,
        ipfs_hash: String
    }
}
```

## Data Flow

### 1. Donation Flow

```
┌─────────┐
│  Donor  │
└────┬────┘
     │ 1. Connect Wallet
     ▼
┌──────────────────┐
│ Wallet Provider  │
└────┬─────────────┘
     │ 2. Select Organization & Project
     ▼
┌──────────────────┐
│  Frontend Form   │
└────┬─────────────┘
     │ 3. signAndSubmitTransaction({
     │      function: "donate_to_organization",
     │      arguments: [org_id, project_id, amount]
     │    })
     ▼
┌──────────────────────┐
│  Aptos Blockchain    │
│                      │
│  • Verify signature  │
│  • Transfer APT      │
│  • Update balances   │
│  • Emit event        │
└────┬─────────────────┘
     │ 4. DonationReceived Event
     ▼
┌──────────────────┐
│  Frontend Query  │
│                  │
│  • Poll events   │
│  • Update UI     │
│  • Show success  │
└──────────────────┘
```

### 2. Expense Recording Flow

```
┌──────────────┐
│ Organization │
└──────┬───────┘
       │ 1. Upload proof document (receipt/photo)
       ▼
┌─────────────────┐
│ Frontend Upload │
└──────┬──────────┘
       │ 2. POST /upload-proof (multipart/form-data)
       ▼
┌─────────────────────┐
│  Backend API        │
│  (Express + Multer) │
└──────┬──────────────┘
       │ 3. Upload to IPFS
       ▼
┌────────────────┐
│  Pinata IPFS   │
│                │
│  • Store file  │
│  • Return CID  │
└──────┬─────────┘
       │ 4. IPFS Hash (CID)
       ▼
┌────────────────────┐
│  Frontend          │
└──────┬─────────────┘
       │ 5. signAndSubmitTransaction({
       │      function: "record_expense",
       │      arguments: [org_id, project_id, amount, 
       │                  description, ipfs_hash]
       │    })
       ▼
┌──────────────────────┐
│  Aptos Blockchain    │
│                      │
│  • Verify signer     │
│  • Store expense     │
│  • Link IPFS hash    │
│  • Emit event        │
└────┬─────────────────┘
       │ 6. ExpenseRecorded Event
       ▼
┌─────────────────────────┐
│  Public Verification    │
│                         │
│  Anyone can:            │
│  • Query blockchain     │
│  • Get IPFS hash        │
│  • View proof document  │
└─────────────────────────┘
```

### 3. Public Audit Flow

```
┌───────────────┐
│ Citizen/      │
│ Auditor       │
└───────┬───────┘
        │ 1. Open Verify/Audit Page (no wallet needed)
        ▼
┌──────────────────┐
│  Frontend Query  │
└───────┬──────────┘
        │ 2. Query blockchain events
        ▼
┌─────────────────────────┐
│  Aptos Blockchain       │
│                         │
│  GET /events/donations  │
│  GET /events/expenses   │
└───────┬─────────────────┘
        │ 3. Return all transactions
        ▼
┌─────────────────────┐
│  Frontend Process   │
│                     │
│  • Parse events     │
│  • Extract IPFS CIDs│
│  • Generate links   │
└───────┬─────────────┘
        │ 4. Display with IPFS links
        ▼
┌────────────────────────────┐
│  Public Verification UI    │
│                            │
│  Expense #123              │
│  Amount: 1000 APT          │
│  Proof: [View on IPFS] ←── Links to multiple gateways
│         [gateway.pinata]   │
│         [ipfs.io]          │
└────────────────────────────┘
```

## Technology Stack

### Frontend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | UI component framework |
| **Language** | TypeScript 5.2 | Type-safe development |
| **Build Tool** | Vite 5.4 | Fast build and HMR |
| **Styling** | Tailwind CSS 3.4 | Utility-first CSS |
| **UI Library** | shadcn/ui | Pre-built components |
| **Wallet** | Aptos Wallet Adapter | Multi-wallet support |
| **HTTP Client** | Fetch API | API communication |
| **Routing** | React Router | Client-side routing |

### Backend Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js 4.18 | Web framework |
| **Blockchain** | @aptos-labs/ts-sdk | Aptos interaction |
| **Storage** | Pinata Web3 SDK | IPFS integration |
| **File Upload** | Multer | Multipart form handling |
| **CORS** | cors | Cross-origin support |

### Blockchain Stack

| Component | Technology | Details |
|-----------|-----------|---------|
| **Network** | Aptos Testnet | L1 blockchain |
| **Language** | Move | Smart contract language |
| **SDK** | Aptos TypeScript SDK | Client library |
| **Wallet** | Petra, Pontem, Martian | Wallet options |
| **Explorer** | Aptos Explorer | Transaction viewer |

### Storage Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Protocol** | IPFS | Decentralized storage |
| **Service** | Pinata | IPFS pinning service |
| **Gateway** | Multiple gateways | Redundant access |
| **Addressing** | Content IDs (CIDs) | Immutable references |

### Deployment Stack

| Component | Service | Region |
|-----------|---------|--------|
| **Frontend** | Appwrite Static Sites | Frankfurt |
| **Backend** | Appwrite Cloud Functions | Frankfurt |
| **CDN** | Appwrite CDN | Global |
| **DNS** | Appwrite Domains | Global |
| **CI/CD** | GitHub + Appwrite | Auto-deploy |

## Security Architecture

### Authentication & Authorization

```
┌──────────────────────────────────────────────────────────┐
│                    Security Layers                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 1: Wallet-Based Authentication                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │  • Private key stored in browser wallet            │  │
│  │  • User signs transactions with private key        │  │
│  │  • Public key verifies signature on-chain          │  │
│  │  • No passwords or centralized auth                │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  Layer 2: Smart Contract Validation                      │
│  ┌────────────────────────────────────────────────────┐  │
│  │  • Only organization owner can record expenses     │  │
│  │  • Donor signature required for donations          │  │
│  │  • Amount validation (must be > 0)                 │  │
│  │  • Balance checks before transfers                 │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  Layer 3: IPFS Content Integrity                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │  • Content-addressed storage (CID = hash)          │  │
│  │  • Tampering changes the hash                      │  │
│  │  • Multiple gateway redundancy                     │  │
│  │  • Permanent storage via pinning                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  Layer 4: Public Verification                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │  • All transactions publicly auditable             │  │
│  │  • No auth required for read operations            │  │
│  │  • Blockchain immutability                         │  │
│  │  • Event log transparency                          │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Data Security

| Data Type | Storage | Security Measures |
|-----------|---------|------------------|
| **Donations** | Aptos Blockchain | Immutable, cryptographically signed |
| **Expenses** | Aptos Blockchain | Immutable, owner-verified |
| **Proof Documents** | IPFS | Content-addressed, tamper-evident |
| **User Keys** | Browser Wallet | Encrypted, never transmitted |
| **API Keys** | Appwrite Secrets | Encrypted environment variables |

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repository                        │
│                   github.com/mdsaad31/DappTrack             │
└─────────────────┬───────────────────────────────────────────┘
                  │ Push to main branch
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Appwrite Cloud (Frankfurt)                     │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           CI/CD Pipeline                            │    │
│  │  1. Detect commit                                   │    │
│  │  2. npm install                                     │    │
│  │  3. npm run build                                   │    │
│  │  4. Deploy to CDN                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌──────────────────────┐    ┌────────────────────────┐    │
│  │   Static Site        │    │   Cloud Function       │    │
│  │   (Frontend)         │    │   (Backend API)        │    │
│  │                      │    │                        │    │
│  │  Domain:             │    │  Domain:               │    │
│  │  dapptrack           │    │  692bd4b700399555dd56  │    │
│  │  .appwrite.network   │    │  .fra.appwrite.run     │    │
│  │                      │    │                        │    │
│  │  Content:            │    │  Runtime:              │    │
│  │  • HTML/CSS/JS       │    │  • Node.js 18          │    │
│  │  • React bundles     │    │  • Express.js          │    │
│  │  • Static assets     │    │  • Aptos SDK           │    │
│  │                      │    │  • Pinata SDK          │    │
│  └──────────────────────┘    └────────────────────────┘    │
│            ↓                           ↓                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Appwrite Global CDN                      │    │
│  │  • Edge caching                                     │    │
│  │  • SSL/TLS termination                              │    │
│  │  • DDoS protection                                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                  │                           │
                  ▼                           ▼
┌──────────────────────────┐    ┌───────────────────────────┐
│   Aptos Testnet          │    │   Pinata IPFS             │
│   (Blockchain)           │    │   (File Storage)          │
│                          │    │                           │
│  • Smart contracts       │    │  • Proof documents        │
│  • Transaction history   │    │  • Permanent storage      │
│  • Event logs            │    │  • Global gateways        │
└──────────────────────────┘    └───────────────────────────┘
```

### Environment Configuration

**Frontend (.env):**
```bash
VITE_APP_NETWORK=testnet
VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS=0x80ab1ccee8fbcfdbd54e0efe1643a41617b4cf7ca7659be6dc0169d2dddf275b
VITE_BACKEND_URL=https://692bd4b700399555dd56.fra.appwrite.run
```

**Backend (Appwrite Function Variables):**
```bash
VITE_APP_NETWORK=testnet
VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS=0x80ab1ccee8fbcfdbd54e0efe1643a41617b4cf7ca7659be6dc0169d2dddf275b
PINATA_API_KEY=***
PINATA_SECRET_KEY=***
PINATA_JWT=***
```

### Scaling Strategy

| Component | Current Setup | Scaling Approach |
|-----------|--------------|------------------|
| **Frontend** | Static CDN | Automatic (CDN edge caching) |
| **Backend** | Single function | Auto-scale based on requests |
| **Blockchain** | Aptos validators | Network-level scaling |
| **IPFS** | Pinata service | Distributed storage by design |

---

## Monitoring & Observability

### Metrics Tracked

1. **Frontend Performance**
   - Page load time
   - Time to interactive
   - Core Web Vitals

2. **Backend Performance**
   - Function execution time
   - API response times
   - Error rates

3. **Blockchain Metrics**
   - Transaction success rate
   - Gas costs
   - Event query latency

4. **Storage Metrics**
   - IPFS upload success
   - Gateway response times
   - Storage usage

### Logging

- **Frontend:** Browser console (development)
- **Backend:** Appwrite function logs
- **Blockchain:** Aptos Explorer
- **IPFS:** Pinata dashboard

---

*Last Updated: November 30, 2025*
