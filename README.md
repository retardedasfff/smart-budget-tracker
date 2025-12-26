# 🔒 Smart Budget Tracker

**Fully Homomorphic Encryption (FHE) Budget Management Application**

A privacy-preserving budget tracking application built with Zama FHEVM. All transaction amounts are encrypted using Fully Homomorphic Encryption before being stored on the blockchain, ensuring complete financial privacy.

## ✨ Features

- 🔐 **FHE Encryption**: All transaction amounts are encrypted using Zama FHEVM before storage
- 💰 **Expense & Income Tracking**: Add, edit, and delete transactions
- 🏷️ **Tagging System**: Organize transactions with custom tags
- 👥 **Budget Sharing**: Share your budget with trusted addresses
- 🔍 **Privacy-First**: Transaction amounts are never exposed on-chain
- 📊 **Transaction History**: View all your encrypted transactions
- 🌐 **Web3 Integration**: Connect with any Ethereum wallet via ConnectKit

## 🚀 Live Demo

**Production URL**: [https://encrypted-budget.vercel.app](https://encrypted-budget.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Wallet**: Wagmi, ConnectKit
- **Encryption**: Zama FHEVM Relayer SDK
- **Smart Contracts**: Solidity (Hardhat)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm
- Ethereum wallet (MetaMask, WalletConnect, etc.)
- Sepolia testnet ETH (for transactions)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wallet-5
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file**
   ```bash
   cp ENV_EXAMPLE.txt .env.local
   ```

4. **Configure environment variables**
   ```env
   NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS=0x694975bABd35555f88D6617438aCA25aaFA3cBa1
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
   PRIVATE_KEY=your_private_key_for_deployment
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Smart Contract

### Contract Address (Sepolia)

```
BudgetManager: 0x694975bABd35555f88D6617438aCA25aaFA3cBa1
Network: Sepolia Testnet
```

### Contract Features

- Stores encrypted transaction amounts as `bytes32` FHE handles
- Supports income and expense transactions
- Tag and description metadata
- Access control for budget sharing
- View functions for metadata (amounts remain encrypted)

### Deploy Contract

```bash
npm run deploy:sepolia
```

Or use the simple deployment script:

```bash
node scripts/deploy-simple.js
```

## 🏗️ Project Structure

```
wallet-5/
├── app/                    # Next.js app directory
│   ├── budget/            # Budget management page
│   ├── shared/            # Shared budgets page
│   ├── about/             # About page
│   └── layout.tsx         # Root layout
├── contracts/             # Smart contracts
│   └── BudgetManager.sol  # Main contract
├── hooks/                 # React hooks
│   ├── useBudget.ts       # Budget operations hook
│   ├── useTransaction.ts  # Transaction data hook
│   └── useUserTransactions.ts
├── lib/                   # Utilities
│   └── fheEncryption.ts   # FHE encryption logic
├── config/                # Configuration
│   └── contracts.ts       # Contract addresses
├── scripts/               # Deployment scripts
│   ├── deploy.js          # Hardhat deployment
│   └── deploy-simple.js   # Simple deployment
└── utils/                 # Helper functions
    └── address.ts         # Address utilities
```

## 🔐 How FHE Works

1. **Encryption**: Transaction amounts are encrypted client-side using Zama FHEVM Relayer SDK
2. **Storage**: Encrypted amounts are stored on-chain as `bytes32` handles
3. **Display**: Original amounts are stored in localStorage for display (client-side only)
4. **Privacy**: On-chain data is fully encrypted - only the user can decrypt

## 📦 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `SEPOLIA_RPC_URL`

## 🧪 Usage

1. **Connect Wallet**: Click "Connect Wallet" and select your Ethereum wallet
2. **Add Transaction**: 
   - Go to "Your Budget" page
   - Click "Add Transaction"
   - Select type (Expense/Income)
   - Enter amount, tag, and description
   - Amount is encrypted before submission
3. **View Transactions**: All your transactions are displayed with decrypted amounts
4. **Share Budget**: Share your budget with other wallet addresses
5. **View Shared**: View budgets shared with you

## 🔒 Security Notes

- Transaction amounts are encrypted using FHE before blockchain storage
- Original amounts are stored in browser localStorage (client-side only)
- Only transaction metadata (tags, descriptions, timestamps) are public on-chain
- Budget sharing requires explicit wallet address permission

## 📚 Resources

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Wagmi Documentation](https://wagmi.sh)
- [Next.js Documentation](https://nextjs.org/docs)
- [Ethereum Sepolia Faucet](https://sepoliafaucet.com)

## 📄 License

MIT

---

**Built with 🔒 FHE technology by Zama**
