const hre = require("hardhat");
<<<<<<< HEAD
require("dotenv").config();

async function main() {
  console.log("Starting deployment to Sepolia...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy CharacterManager
  console.log("\n1. Deploying CharacterManager...");
  const CharacterManager = await hre.ethers.getContractFactory("CharacterManager");
  const characterManager = await CharacterManager.deploy();
  await characterManager.waitForDeployment();
  const characterManagerAddress = await characterManager.getAddress();
  console.log("CharacterManager deployed to:", characterManagerAddress);

  // Deploy GalleryManager
  console.log("\n2. Deploying GalleryManager...");
  const GalleryManager = await hre.ethers.getContractFactory("GalleryManager");
  const galleryManager = await GalleryManager.deploy(characterManagerAddress);
  await galleryManager.waitForDeployment();
  const galleryManagerAddress = await galleryManager.getAddress();
  console.log("GalleryManager deployed to:", galleryManagerAddress);

  // Link GalleryManager to CharacterManager
  console.log("\n3. Linking contracts...");
  const setGalleryTx = await characterManager.setGalleryManager(galleryManagerAddress);
  await setGalleryTx.wait();
  console.log("Contracts linked successfully!");
=======
const path = require("path");
const fs = require("fs");

// Load .env manually
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach(line => {
    const [key, ...values] = line.split("=");
    if (key && values.length > 0) {
      process.env[key.trim()] = values.join("=").trim();
    }
  });
}

async function main() {
  console.log("Starting deployment to Sepolia...\n");
  
  const privateKey = process.env.PRIVATE_KEY || "7d92d7f755e746cba649b3e22bdab29d428078fb4d993280b79fb138c0a94554";
  const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
  
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found");
  }
  
  console.log("RPC URL:", rpcUrl);
  console.log("Private key configured:", privateKey ? "Yes" : "No");

  const [deployer] = await hre.ethers.getSigners();
  if (!deployer) {
    throw new Error("Failed to get deployer signer. Check your network configuration and private key.");
  }
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy BudgetManager
  console.log("\n1. Deploying BudgetManager...");
  const BudgetManager = await hre.ethers.getContractFactory("BudgetManager");
  const budgetManager = await BudgetManager.deploy();
  await budgetManager.waitForDeployment();
  const budgetManagerAddress = await budgetManager.getAddress();
  console.log("BudgetManager deployed to:", budgetManagerAddress);
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    deployer: deployer.address,
    contracts: {
<<<<<<< HEAD
      CharacterManager: characterManagerAddress,
      GalleryManager: galleryManagerAddress,
=======
      BudgetManager: budgetManagerAddress,
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("\n✅ Deployment completed successfully!");

  // Instructions for verification
  console.log("\n=== Verification Commands ===");
<<<<<<< HEAD
  console.log(`npx hardhat verify --network sepolia ${characterManagerAddress}`);
  console.log(`npx hardhat verify --network sepolia ${galleryManagerAddress} "${characterManagerAddress}"`);

  return deploymentInfo;
=======
  console.log(`npx hardhat verify --network sepolia ${budgetManagerAddress}`);
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

<<<<<<< HEAD




=======
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
