# EncryptedBudget

Private Budget Management DApp built with Fully Homomorphic Encryption (FHE) technology.

## Features

- **Add Expenses & Income**: Track your financial transactions with tags and descriptions
- **Edit & Delete**: Full CRUD operations for your transactions
- **Tag-based Organization**: Organize transactions by custom tags
- **Budget Sharing**: Share your budget with specific wallet addresses
- **Privacy First**: All data encrypted using FHE technology
- **User Statistics**: View total number of active users

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Ethereum Sepolia Testnet
- **Web3**: Wagmi, ConnectKit, Viem
- **Encryption**: FHEVM.js (Fully Homomorphic Encryption)
- **Smart Contracts**: Solidity, Hardhat

## Project Structure

```
FHE_PROJECTS/EncryptedBudget/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── budget/             # Your Budget page
│   ├── shared/             # Visible Budgets page
│   ├── layout.tsx          # Root layout
│   ├── providers.tsx       # Wagmi & ConnectKit providers
│   └── globals.css         # Global styles
├── contracts/              # Solidity smart contracts
│   └── BudgetManager.sol  # Main contract
├── hooks/                  # React hooks
│   ├── useBudget.ts       # Budget management hook
│   └── useTransaction.ts  # Transaction data hook
├── utils/                  # Utility functions
│   └── address.ts         # Address normalization
├── abis/                   # Contract ABIs
└── scripts/               # Deployment scripts
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS=0x06B09Ba5b75f0CB5DbB80975CA54fA599Fbb4748
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key
```

## Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS`
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### Deploy Contracts

```bash
npm run deploy:sepolia
```

## Contract Address

**BudgetManager**: `0x06B09Ba5b75f0CB5DbB80975CA54fA599Fbb4748` (Sepolia)

## License

MIT

