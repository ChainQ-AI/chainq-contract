const { ethers, upgrades } = require("hardhat");

async function main() {
  console.log("Deploying ChainQ Upgradable contract...");

  // Deploy the upgradeable contract
  const Chainq = await ethers.getContractFactory("chainQ");
  const chainq = await upgrades.deployProxy(Chainq, [
    "100000000000000000", // underlying asset address
  ]);

  console.log("Proxy of ChainQ deployed to:", chainq.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
