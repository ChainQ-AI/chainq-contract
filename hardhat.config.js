require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config({ path: __dirname + "/.env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.21",
  networks: {
    scroll: {
      url: process.env.RPC_URL, //Your RPC URL
      accounts: [process.env.PRIVATE_KEY], //Your private key
    },
  },
};
