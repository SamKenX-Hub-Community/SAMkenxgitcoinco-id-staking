// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const admin = "0x14a78dE2263FC6665Dac7ACb7f492A1eA474F836";

  await deploy("Token", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
  });

  const Token = await ethers.getContract("Token", deployer);

  const stakingArgs = [Token.address];

  await deploy("IDStaking", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: stakingArgs,
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const IDStaking = await ethers.getContract("IDStaking", deployer);
  await IDStaking.transferOwnership(admin);

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  try {
    if (chainId !== localChainId) {
      await run("verify:verify", {
        address: IDStaking.address,
        contract: "contracts/IDStaking.sol:IDStaking",
        constructorArguments: stakingArgs,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["IDStaking", "Token"];