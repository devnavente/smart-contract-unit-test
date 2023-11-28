require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
//require('@nomiclabs/hardhat-waffle');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    goerli: {
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};
