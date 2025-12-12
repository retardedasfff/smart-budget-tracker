# FHE TicTacToe (3x3)

Two-player TicTacToe with manual toggle between Relayer (real) and Mock contracts on Sepolia.

## Stack
- Next.js 14, Tailwind
- Wagmi + ConnectKit
- Solidity (real + mock contracts)

## Env
Create `.env.local`:
```
NEXT_PUBLIC_TTT_RELAY_ADDRESS=0x...
NEXT_PUBLIC_TTT_MOCK_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
```

Optional `.env` for Hardhat:
```
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key
```

## Scripts
```
npm install
npm run dev
```

## Contracts
- `TicTacToeRelayer.sol`: stores encrypted player identifiers (bytes from relayer SDK).
- `TicTacToeMock.sol`: open version for debugging.

## Todo wiring
- Integrate `@zama-fhe/relayer-sdk` (`createInstance(SepoliaConfig)` + relayerUrl `https://relayer.testnet.zama.org`).
- Route create/join/move to selected contract by toggle.

---

# FHE 井字棋 (3x3)

双人 3x3 井字棋，可在 Sepolia 上手动切换 Relayer（真实合约）与 Mock 合约。

## 技术栈
- Next.js 14, Tailwind
- Wagmi + ConnectKit
- Solidity（真实合约 + Mock 合约）

## 环境变量
创建 `.env.local`：
```
NEXT_PUBLIC_TTT_RELAY_ADDRESS=0x...
NEXT_PUBLIC_TTT_MOCK_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
```

可选的 Hardhat `.env`：
```
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key
```

## 脚本
```
npm install
npm run dev
```

## 合约
- `TicTacToeRelayer.sol`：保存通过 relayer SDK 获取的加密玩家标识（bytes）。
- `TicTacToeMock.sol`：用于调试的公开版本。

## 待接线
- 集成 `@zama-fhe/relayer-sdk`（`createInstance(SepoliaConfig)` + relayerUrl `https://relayer.testnet.zama.org`）。
- 根据切换按钮将 create/join/move 调用路由到选定合约。

