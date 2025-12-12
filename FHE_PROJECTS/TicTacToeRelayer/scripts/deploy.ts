const hre = require("hardhat");

async function main() {
  const argName = process.argv.find((a) => a.startsWith("--contract="))?.split("=")[1];
  const contractName = process.env.CONTRACT || argName || "TicTacToeRelayer";

  console.log(`Deploying ${contractName}...`);
  const Factory = await hre.ethers.getContractFactory(contractName);
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`${contractName} deployed at: ${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

