const { ethers } = require("hardhat");

async function main() {
  const contractAddress = "0x462C0470a279D2031Ebc00B8b0d9F48Fe2006f54"; // Replace with the actual contract address

  // Connect to the contract
  const contract = await ethers.getContractAt("chainQ", contractAddress);

  const getPrice = await contract.subscriptionPrice();
  console.log(getPrice);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
