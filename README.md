
# 🔐 TRANScrypt - Decentralized Offline-First Peer-to-Peer Payments

![Project Banner](src/assets/banner.png)

> **"Banking the Unbanked, Connecting the Disconnected"**  
> A revolutionary payment solution that works with or without internet connectivity

## 🌟 About TRANScrypt

TRANScrypt is a groundbreaking financial inclusion platform designed to empower millions in rural and low-connectivity regions with secure digital payment capabilities. By combining decentralized blockchain technology with innovative offline protocols, we're eliminating the dependency on continuous internet connectivity for basic financial transactions.

**#HackathonWinner #BlockchainRevolution #FinTechInnovation #Web3 #DeCentralizedFinance #OfflineFirst #StellarNetwork #FinancialInclusion #HackHazards**

## ✨ Key Features

### 🌐 Connectivity Agnostic
- **Offline Transaction Signing** - Cryptographically secure payments without internet
- **Smart Sync Technology** - Automatic cloud synchronization when connectivity resumes
- **Multi-Channel Communication** - Bluetooth/NFC/Mesh network support

### 💰 Financial Tools
- **Intelligent Bill Splitting** 
  - Equal divisions
  - Custom ratio splits
  - Percentage-based allocations
- **Real-Time Currency Conversion** - 150+ supported currencies
- **Group Payment Pools** - Collaborative savings and expense management

### 🔒 Security
- **Military-Grade Encryption** - End-to-end transaction security
- **Biometric Authentication** - Fingerprint/Face ID support
- **On-Chain Transparency** - Immutable transaction records

### 🎛️ User Experience
- **Adaptive Interface** - Light/Dark mode with high-contrast options
- **Voice-Guided Navigation** - Accessibility-first design
- **Data-Efficient** - Optimized for low-bandwidth environments

## 🛠 Technology Stack

### Frontend Development
<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP">
</p>

### Backend Infrastructure
<p align="left">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT">
</p>

### Blockchain & Security
<p align="left">
  <img src="https://img.shields.io/badge/Solidity-e6e6e6?style=for-the-badge&logo=solidity&logoColor=black" alt="Solidity">
  <img src="https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white" alt="Ethereum">
  <img src="https://img.shields.io/badge/Stellar-090909?style=for-the-badge&logo=stellar&logoColor=white" alt="Stellar">
</p>

### Data Management
<p align="left">
  <img src="https://img.shields.io/badge/IndexedDB-ED8B00?style=for-the-badge&logo=indexeddb&logoColor=white" alt="IndexedDB">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
</p>

### Partner Technologies
<p align="left">
  <img src="https://img.shields.io/badge/Groq-00FF00?style=for-the-badge&logo=groq&logoColor=white" alt="Groq">
  <img src="https://img.shields.io/badge/Monad-000000?style=for-the-badge&logo=monad&logoColor=white" alt="Monad">
  <img src="https://img.shields.io/badge/Fluvio-0066FF?style=for-the-badge&logo=fluvio&logoColor=white" alt="Fluvio">
  <img src="https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=base&logoColor=white" alt="Base">
  <img src="https://img.shields.io/badge/Screenpiece-FF6600?style=for-the-badge&logo=screenpiece&logoColor=white" alt="Screenpiece">
</p>

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.10+
- MongoDB Atlas account (for cloud sync)
- MetaMask (for blockchain interactions)

### Installation
```bash
# Clone the repository
git clone https://github.com/kanaksharma67/transccrypt.git

# Navigate to project directory
cd transccrypt

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
```

### Running the Application
```bash
# Start frontend development server
npm run dev

# In separate terminal, start backend server
cd server
python app.py
```

## 📂 Project Architecture

```
TRANSCRYPT/
├── src/                     # Frontend Application
│   ├── assets/              # Static assets (images, fonts)
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Generic components
│   │   ├── wallet/          # Wallet-specific components
│   │   └── transactions/    # Transaction flow components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and helpers
│   │   ├── blockchain/      # Blockchain interactions
│   │   ├── offline/         # Offline transaction handling
│   │   └── sync/            # Cloud synchronization
│   ├── pages/               # Application views
│   │   ├── auth/            # Authentication flows
│   │   ├── dashboard/       # Main application interface
│   │   ├── transactions/    # Transaction management
│   │   └── settings/        # User preferences
│   ├── stores/              # State management
│   └── styles/              # Global styles and themes
│
├── server/                  # Backend Services
│   ├── controllers/         # Business logic
│   ├── middleware/          # Request processing
│   ├── models/              # Data models
│   ├── routes/              # API endpoints
│   ├── services/            # External service integrations
│   └── utils/               # Helper functions
│
├── contracts/               # Smart Contracts
│   ├── build/               # Compiled contracts
│   ├── migrations/          # Deployment scripts
│   └── src/                 # Solidity source files
│
├── scripts/                 # Automation Scripts
│   ├── deployment/          # CI/CD scripts
│   └── database/            # DB migration scripts
│
├── docs/                    # Documentation
│   ├── architecture/        # System diagrams
│   ├── api/                 # API specifications
│   └── guides/              # User/developer guides
│
└── tests/                   # Test suites
    ├── unit/                # Unit tests
    ├── integration/         # Integration tests
    └── e2e/                 # End-to-end tests
```

## 🌈 Meet Team Accers

| Role | Member | Contribution | Social |
|------|--------|--------------|--------|
| **Frontend & UI/UX Lead** | Kanak Sharma | Designed core application flows and interactive elements | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github)](https://github.com/kanaksharma67) |
| **Frontend & UI/UX Lead** | Chirag Pandit | Implemented responsive interfaces and accessibility features | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github)](https://github.com/chiragpandit) |
| **AI/ML Lead** | Swarajit Dey | Developed fraud detection algorithms and predictive analytics | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github)](https://github.com/swarajitdey) |
| **Blockchain Lead** | Akarshan | Architected smart contracts and offline transaction protocol | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github)](https://github.com/akarshan) |

## 📈 Roadmap

### Phase 1: Core Functionality (Completed)
- Offline transaction signing
- Basic wallet operations
- On-chain settlement

### Phase 2: Enhanced Features (In Progress)
- Multi-currency support
- Advanced bill splitting
- Group payment pools

### Phase 3: Future Development
- AI-powered fraud detection
- Voice-based interfaces
- Hardware wallet integration

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙌 Acknowledgments

- **Stellar Development Foundation** for their visionary blockchain platform
- **HackHazards organizers** for creating this incredible opportunity
- **All open-source contributors** whose work made this project possible
- **Our beta testers** for their valuable feedback and patience

---

<p align="center">
  Made with ❤️ by Team Accers | 2024 HackHazards Submission
</p>
```

