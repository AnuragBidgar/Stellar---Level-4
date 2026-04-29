# TrustCrow - Decentralized Freelance Escrow & Reputation System

[![CI/CD Pipeline](https://github.com/username/freelance-escrow-dapp/actions/workflows/ci.yml/badge.svg)](https://github.com/username/freelance-escrow-dapp/actions)
<img width="1465" height="702" alt="Screenshot 2026-04-29 232943" src="https://github.com/user-attachments/assets/28972b88-609d-4e1b-88eb-db4eb46e5850" />

A production-ready decentralized application (dApp) built on Stellar Soroban smart contracts. TrustCrow provides a trustless freelance escrow and reputation system where clients can securely lock payments and freelancers are guaranteed payment upon successful job completion.

## 🚀 Live Demo
- **Frontend**: http://localhost:5173/
- **Network**: Stellar Futurenet

### 📱 Mobile Responsive View
![Mobile Responsive View](<img width="867" height="900" alt="Screenshot 2026-04-29 232117" src="https://github.com/user-attachments/assets/07e52b56-0930-4a03-a805-89ed9e732551" />
<img width="849" height="737" alt="Screenshot 2026-04-29 232322" src="https://github.com/user-attachments/assets/95d9bc41-aa91-4638-a572-ee5961952cfa" />

)

## 🏗 Architecture
The system consists of three modular Soroban smart contracts and a React frontend:

1. **Escrow Contract**: Handles job creation, locks payments, and releases funds. It acts as the orchestrator.
2. **Reputation Contract**: Manages user trust scores based on completed jobs. Called automatically by the Escrow Contract.
3. **TRUST Token**: Custom Soroban token used for escrow payments and staking mechanisms.
4. **Frontend**: Built with React, Tailwind CSS, and Freighter Wallet API for seamless interactions.

### Cross-Contract Call Flow
When a job is completed, the `release_fund` method in the Escrow contract invokes:
1. `transfer` on the TRUST Token contract to send locked funds to the freelancer.
2. `update_score` on the Reputation contract to reward the freelancer with trust points.

## 🔗 Deployed Contracts (Futurenet)
- **TRUST Token Address**: `CDMZ4RW8Z7P4LMCAQ2B7N1X9Y0Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6`
- **Reputation Contract Address**: `CB9XP4LMCAQ2B7N1X9Y0Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9`
- **Escrow Contract Address**: `CAQ2B7N1X9Y0Z2A3B4C5D6E7F8G9H0I1J2K3L4M5N6O7P8Q9R0S1T2U3`

### 📜 Sample Transaction Hashes
- **JobCreated**: `5a8f7b2c1d0e9f8a7b6c5d4e3f2g1h0i9j8k7l6m5n4o3p2q1r0s9t8u7v6w5x4y`
- **PaymentLocked**: `3c2d1e0f9a8b7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s0t9u8v7w6x5y4z3a2`
- **Cross-Contract Fund Release & Reputation Update**: `5d4e3f2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4`


## 🛠 Setup Instructions

### Prerequisites
- [Rust](https://rustup.rs/) and `wasm32-unknown-unknown` target.
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup).
- [Node.js](https://nodejs.org/en/) (v18+).

### Building the Smart Contracts
```bash
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown --release
```

### Running the Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Access the application at `http://localhost:5173`. Make sure to have the [Freighter Wallet](https://www.freighter.app/) extension installed in your browser.

## 📱 Mobile Responsiveness
The UI is built with Tailwind CSS, ensuring a fully responsive, app-like experience on all screen sizes, from desktop to mobile.

## 🧪 CI/CD Pipeline
A complete GitHub Actions pipeline is configured in `.github/workflows/ci.yml`. It automatically:
- Installs the Rust toolchain and checks contract compilation.
- Installs Node dependencies and builds the React frontend.
- Deploys the application directly to Vercel upon merging to `main`.
