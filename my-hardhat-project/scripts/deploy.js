async function main() {
    // Get the signers (accounts) from the Hardhat network
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Get the contract factory
    const BlockEstate = await ethers.getContractFactory("BlockEstate");

    // Deploy the contract
    const blockEstate = await BlockEstate.deploy();

    // Wait for the deployment transaction to be mined
    //await blockEstate.deployed();

    // Log the contract address after it has been deployed
    console.log("BlockEstate contract deployed to:", blockEstate.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
