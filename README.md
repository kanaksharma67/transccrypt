<p align="center">
  <img src="src/assets/LOGO_main.jpeg" alt="TRANScrypt Logo" width="300" height="300"/>
</p>

<h1 align="center">🔐 Welcome to <span style="color:#10B981">TRANScrypt</span> - Decentralized, Offline‑Ready Peer‑to‑Peer Payments</h1>

---

<div style="width: 280px; text-align: center; margin: 0 auto;">
  <img src="src/assets/TRANScrypt_screenshot.png" alt="App Screenshot" style="width: 100%; height: auto; border-radius: 8px;"/>
</div>

---

# Project Presentation & Demo

- 🎞️ [**Watch Demo Video**](https://youtu.be/your-demo-link)  
- 🌐 [**Live Preview**](https://your-transcrypt-app.vercel.app/)  

---

## 📚 Table of Contents
- [🌟 Vision](#vision)  
- [✍️ Project Description](#project-description)  
- [📝 Proposed System](#proposed-system)  
- [✨ Key Features](#key-features)  
- [📷 Interface Preview](#interface-preview)  
- [💻 Tech Stack](#tech-stack)  
- [📱 App Structure](#app-structure)  
- [⛔ Existing Limitations](#existing-limitations)  
- [🚦 Getting Started](#getting-started)  
- [🔄 Typical User Flow](#typical-user-flow)  
- [📞 Contact](#contact)  

---

## <a id="vision"></a>🌟 Vision

TRANScrypt empowers users everywhere — even in offline or low‑connectivity zones — to securely exchange value, split expenses, and manage group payments without relying on centralized servers. By harnessing cryptographic offline validation and seamless on‑chain syncing, we bridge the gap between convenience and decentralization.

<p align="right"><a href="#-table-of-contents">🔝 Back to Top</a></p>

---

## <a id="project-description"></a>✍️ Project Description

TRANScrypt is a blockchain‑based payment application designed for travellers, remote communities, and everyday groups who need:

- **Offline Transactions**: Send and receive payments when there’s no internet, then sync securely once reconnected.  
- **Customizable Bill Splitting**: Split restaurant tabs, rent, or group gifts equally or by any ratio (e.g., 40–60, 20–30–50).  
- **Multi‑Currency Support**: Perform real‑time conversions automatically when parties transact across borders.  

Our solution solves the pain of centralized digital wallets that break in poor network conditions, and streamlines shared expense management with full transparency and auditability on the blockchain.

<p align="right"><a href="#-table-of-contents">🔝 Back to Top</a></p>

---

## <a id="proposed-system"></a>📝 Proposed System

- **Offline TX Queue & Validation**  
  Store cryptographically‑signed transactions locally.  
- **Blockchain Sync Engine**  
  Auto‑sync pending transactions to smart contracts when online.  
- **Smart Contract Suite**  
  Handles peer‑to‑peer transfers, splits, and settlement logic on‑chain.  
- **Currency Conversion Module**  
  Fetches up‑to‑date FX rates and applies conversions at the point of sync.  
- **Notification & Alerts**  
  Inform users of successful payments, outstanding dues, and reconnection syncs.  

<p align="right"><a href="#-table-of-contents">🔝 Back to Top</a></p>

---

## <a id="key-features"></a>✨ Key Features

### 🔑 Core Functionality
- ✅ **Secure Offline Transactions** – Sign and queue payments without internet.  
- 📊 **Custom Bill Splitting** – Equally or ratio‑based splits with a few taps.  
- 💱 **Real‑Time Currency Conversion** – Automatic FX at settlement.  
- 🔗 **On‑Chain Transparency** – All settled transactions recorded on blockchain.  
- 🌙 **Dark‑Themed, Modular UI** – Intuitive, adaptive design for any environment.

### 🚀 Advanced Features
- 📥 **Offline Queue Management** – View, edit, or cancel pending transfers.  
- 👥 **Group Payment Workflows** – Create “pools” for shared expenses.  
- 🔔 **Rich Notifications** – Alerts for splits, payments, and sync status.  
- 🔒 **Smart Contract Security** – Audited logic for dispute‑free settlements.  

<p align="right"><a href="#-table-of-contents">🔝 Back to Top</a></p>

---

## <a id="interface-preview"></a>📷 Interface Preview

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin: 30px 0;">
  <div style="width: 200px; text-align: center;">
    <img src="src/assets/landing.png" alt="Landing Page" style="width: 100%; border-radius: 6px;"/>
    <p style="font-size: 13px; margin-top: 8px;">Landing Page</p>
  </div>
  <div style="width: 200px; text-align: center;">
    <img src="src/assets/offline_queue.png" alt="Offline Queue" style="width: 100%; border-radius: 6px;"/>
    <p style="font-size: 13px; margin-top: 8px;">Offline Queue</p>
  </div>
  <div style="width: 200px; text-align: center;">
    <img src="src/assets/split_bill.png" alt="Bill Splitting" style="width: 100%; border-radius: 6px;"/>
    <p style="font-size: 13px; margin-top: 8px;">Bill Splitting</p>
  </div>
  <div style="width: 200px; text-align: center;">
    <img src="src/assets/sync_status.png" alt="Sync Status" style="width: 100%; border-radius: 6px;"/>
    <p style="font-size: 13px; margin-top: 8px;">Sync Status</p>
  </div>
</div>

<p align="right"><a href="#-table-of-contents">🔝 Back to Top</a></p>

---

## <a id="tech-stack"></a>💻 Tech Stack

<div align="center">
  <img src="https://skillicons.dev/icons?i=react,tailwind,nodejs,express,web3,solidity,postgres,redis,typescript&theme=dark&perline=6" alt="Tech Stack Icons"/>
</div>

- **Frontend**: React, Tailwind CSS, TypeScript  
- **Backend & API**: Node.js, Express, TypeScript  
- **Blockchain**: Solidity smart contracts on Ethereum / EVM-compatible chain  
- **Database & Cache**: PostgreSQL, Redis (for offline queue persistence)  
- **Auth & Security**: JWT, client‑side cryptographic signing  
- **DevOps**: Docker, GitHub Actions, Vercel / AWS  

<p align="right"><a href="#-table-of-contents">🔝 Back to Top</a></p>

---

## <a id="app-structure"></a>📱 App Structure

```bash
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
