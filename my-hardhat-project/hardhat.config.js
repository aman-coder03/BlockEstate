require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337 // Default Hardhat Network chain ID
    },
    // Uncomment the following to deploy to a testnet like Rinkeby or Goerli
    // rinkeby: {
    //   url: `https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
    //   accounts: [`0x${YOUR_PRIVATE_KEY}`]
    // }
  }
};
