const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.SEPOLIA_RPC_URL || "https://sepolia.drpc.org";

if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY not found in .env.local");
}

async function deploy() {
  console.log("Deploying BudgetManager contract to Sepolia...\n");

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  console.log("Deployer address:", wallet.address);
  const balance = await provider.getBalance(wallet.address);
  console.log("Balance:", ethers.formatEther(balance), "ETH\n");

  // Read contract source
  const contractPath = path.join(__dirname, "../contracts/BudgetManager.sol");
  const contractSource = fs.readFileSync(contractPath, "utf8");

  // Compile with solc
  const solc = require("solc");
  
  console.log("Compiling BudgetManager...");
  const input = {
    language: "Solidity",
    sources: {
      "BudgetManager.sol": {
        content: contractSource,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  if (output.errors) {
    output.errors.forEach(err => {
      if (err.severity === "error") {
        console.error("Compilation error:", err.message);
      }
    });
    if (output.errors.some(err => err.severity === "error")) {
      process.exit(1);
    }
  }

  const contract = output.contracts["BudgetManager.sol"]["BudgetManager"];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  // Deploy BudgetManager
  console.log("\n1. Deploying BudgetManager...");
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const budgetManager = await factory.deploy();
  await budgetManager.waitForDeployment();
  const budgetManagerAddress = await budgetManager.getAddress();
  console.log("✅ BudgetManager deployed to:", budgetManagerAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("Network: Sepolia");
  console.log("Deployer:", wallet.address);
  console.log("BudgetManager:", budgetManagerAddress);
  console.log("\n✅ Deployment completed successfully!");

  // Update .env.local with new address
  const envPath = path.join(__dirname, "../.env.local");
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  
  if (envContent.includes("NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS=")) {
    envContent = envContent.replace(
      /NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS=.*/,
      `NEXT_PUBLIC_BUDGET_MANAGER_ADDRESS=${budgetManagerAddress}`
    );
  } else {
    envContent += `\nNEXT_PUBLIC_BUDGET_MANAGER_ADDRESS=${budgetManagerAddress}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log("\n✅ Updated .env.local with contract address");

  return {
    budgetManager: budgetManagerAddress,
  };
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

