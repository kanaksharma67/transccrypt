<div align="center">
  <img src="src/assets/logo.png" alt="TRANScrypt Logo" width="200"/>
  
  # TRANScrypt
  ### Decentralized, Offline‑Ready Peer‑to‑Peer Payments

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Stellar](https://img.shields.io/badge/Stellar-7D00FF?style=for-the-badge&logo=stellar&logoColor=white)](https://www.stellar.org/)
  [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
  [![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white)](https://ethereum.org/)
  
  *Empowering financial transactions in low-connectivity environments*
  
  **[Demo](https://transcrypt.vercel.app) • [Documentation](https://github.com/kanaksharma67/transcrypt/wiki) • [Report Issue](https://github.com/kanaksharma67/transcrypt/issues)**
  
  #hackathon #hackhazards #fintech #blockchain #offlinepayments #p2p
</div>

---

## 🧩 Problem Statement

**Problem Statement 6 – Better Finance for Everyone with Stellar**

Millions of users in rural or low-network regions struggle with basic digital transactions due to poor or no internet connectivity. Traditional payment solutions fail in these environments, creating a significant barrier to financial inclusion and economic participation.

## 🎯 Our Solution

TRANScrypt provides an innovative offline payment solution that enables users to securely make peer-to-peer payments without requiring continuous internet connectivity. This addresses a critical gap in financial accessibility, empowering users to make transactions even in remote areas with limited infrastructure.

<div align="center">
  <img src="src/assets/app-screenshot.png" alt="TRANScrypt App Screenshot" width="80%"/>
</div>

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🔄 **Secure Offline Transactions** | Sign and queue payments without internet connection |
| 📊 **Custom Bill Splitting** | Split bills equally or with custom ratios with just a few taps |
| 💱 **Real‑Time Currency Conversion** | Automatic FX rates applied at settlement time |
| 🔗 **On‑Chain Transparency** | All settled transactions recorded on blockchain for verification |
| 🌙 **Dark‑Themed, Modular UI** | Intuitive, adaptive design for any environment |
| 📥 **Offline Queue Management** | View, edit, or cancel pending transfers |
| 👥 **Group Payment Workflows** | Create "pools" for shared expenses |
| 🔔 **Rich Notifications** | Alerts for splits, payments, and sync status |
| 🔒 **Smart Contract Security** | Audited logic for dispute‑free settlements |

## 🛠️ Tech Stack

### Core Technologies
- **Frontend**: React.js with TypeScript, Tailwind CSS, Accertinity UI, GSAP
- **Backend**: Python, Flask, Stellar SDK
- **Blockchain**: Solidity smart contracts on Ethereum / EVM-compatible chain
- **Database**: IndexedDB (for offline), MongoDB (cloud sync)
- **Auth & Security**: JWT, client‑side cryptographic signing
- **APIs**: Custom Wallet Sync APIs
- **DevOps**: Docker, GitHub Actions, Vercel / AWS
- **Hosting**: Vercel (Frontend), Render (Backend)

### Partner Technologies
- ✅ **Monad**: Transaction achievement tracking and gamification
- ✅ **Fluvio**: Real-time financial dashboard and analytics
- ✅ **Screenpiece**: Screen-based analytics and user journey workflows
- ✅ **Stellar**: Core payment infrastructure, identity verification, and token management

## 🧠 Team

### Team Accers

| Member | Role | GitHub |
|--------|------|--------|
| Kanak Sharma | Frontend & UI/UX Lead | [GitHub](https://github.com/kanaksharma67) |
| Chirag Pandit | Frontend & UI/UX Lead | [GitHub](https://github.com/chiragpandit) |
| Swarajit Dey | AI-ML Lead | [GitHub](https://github.com/swarajitdey) |
| Akarshan | Blockchain Lead | [GitHub](https://github.com/akarshan) |

## 🚀 Our Approach

We chose this problem to tackle the real-world issue of financial exclusion in low-connectivity zones, aiming to bring a reliable and secure digital alternative to cash.

### Key Challenges Addressed:
- Enabling robust offline transaction protocols
- Designing an intuitive user interface for tech-novice users
- Ensuring security and validation without online verification

We implemented Bluetooth/NFC/local mesh networking for offline transfers and integrated an offline-first database model to ensure data persistence and integrity.

## 📂 Project Structure

\`\`\`bash
├── src/
│   ├── assets/              # Logos & screenshots
│   ├── components/          # UI components & hooks
│   ├── pages/
│   │   ├── /                # Landing
│   │   ├── /app             # Main dashboard
│   │   ├── /queue           # Offline transactions
│   │   ├── /split           # Bill splitting
│   │   └── /settings        # User preferences
│   ├── contracts/           # Solidity smart contracts
│   └── lib/                 # Blockchain & API utilities
├── server/
│   ├── controllers/
│   ├── routes/
│   └── services/
├── scripts/                 # Deployment & migration scripts
└── README.md
\`\`\`

## 🎥 Demo & Deliverables

- 🔗 [Demo Video](https://youtu.be/transcrypt-demo)
- 📦 [Deployed Site](https://transcrypt.vercel.app)
- 💻 [GitHub Frontend Repo](https://github.com/kanaksharma67/transcrypt)
- 🛠️ [GitHub Backend Repo](https://github.com/kanaksharma67/transcrypt-backend)
- 📊 [Presentation Slides](https://docs.google.com/presentation/d/transcrypt)

## 🚦 How to Run the Project

### Requirements:
- Node.js v16+
- Python 3.8+
- MongoDB (local or Atlas)
- Stellar testnet account

### Environment Setup:
Create a `.env` file in the root directory with:
\`\`\`
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STELLAR_NETWORK=testnet
REACT_APP_MONGODB_URI=mongodb://localhost:27017/transcrypt
\`\`\`

### Local Development:

\`\`\`bash
# Clone the repo
git clone https://github.com/kanaksharma67/transcrypt

# Install frontend dependencies
cd transcrypt
npm install

# Start frontend development server
npm run dev

# In a separate terminal, set up the backend
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Start backend server
python app.py
\`\`\`

Visit `http://localhost:3000` to see the application running.

## ⛔ Problems with Traditional Digital Wallets

<table>
  <tr>
    <th>Limitation</th>
    <th>TRANScrypt Solution</th>
  </tr>
  <tr>
    <td>🌐 <b>Constant internet requirement</b><br>Transactions fail in rural areas, remote locations, or during travel</td>
    <td>✅ Offline-first architecture with local transaction signing and queuing</td>
  </tr>
  <tr>
    <td>💱 <b>No multi-currency support</b><br>Can't convert between currencies automatically</td>
    <td>✅ Built-in currency conversion at settlement time with competitive rates</td>
  </tr>
  <tr>
    <td>🔄 <b>Lack of offline validation</b><br>Unconfirmed transactions lead to disputes</td>
    <td>✅ Cryptographic offline signing with blockchain settlement</td>
  </tr>
  <tr>
    <td>🏢 <b>Centralized dependency</b><br>Reduced transparency and privacy concerns</td>
    <td>✅ Decentralized architecture with on-chain verification</td>
  </tr>
</table>

## 🔮 Future Roadmap

- 🌍 **Global Expansion**: Support for additional currencies and regions
- 🤝 **Merchant Integration**: Tools for small businesses to accept offline payments
- 🔐 **Enhanced Security**: Biometric authentication and advanced encryption
- 🌐 **Mesh Network**: Expanded offline capabilities through local mesh networks
- 🗣️ **Localization**: Support for 10+ languages to improve accessibility
- 🤖 **AI Fraud Detection**: Machine learning models to identify suspicious transactions

## 🏆 Hackathon Journey

Our team embarked on this hackathon journey with a shared passion for financial inclusion. The biggest challenge we faced was designing a secure transaction protocol that works reliably offline while preventing double-spending. Through countless hours of brainstorming and testing, we developed our unique approach that combines local cryptographic signing with blockchain settlement.

Special thanks to the mentors who provided invaluable guidance, especially on integrating Stellar's payment infrastructure with our offline-first approach.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Stellar Development Foundation for their robust payment infrastructure
- The open-source community for various libraries and tools
- HackHazards organizers for the opportunity to build this solution

---

<div align="center">
  <p>Made with ❤️ by Team Accers</p>
  <p>© 2025 TRANScrypt. All rights reserved.</p>
</div>
