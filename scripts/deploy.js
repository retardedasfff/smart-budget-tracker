const hre = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("Starting deployment to Sepolia...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy BudgetManager
  console.log("\n1. Deploying BudgetManager...");
  const BudgetManager = await hre.ethers.getContractFactory("BudgetManager");
  const budgetManager = await BudgetManager.deploy();
  await budgetManager.waitForDeployment();
  const budgetManagerAddress = await budgetManager.getAddress();
  console.log("BudgetManager deployed to:", budgetManagerAddress);

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    deployer: deployer.address,
    contracts: {
      BudgetManager: budgetManagerAddress,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✅ Deployment completed successfully!");

  // Instructions for verification
  console.log("\n=== Verification Commands ===");
  console.log(`npx hardhat verify --network sepolia ${budgetManagerAddress}`);

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
