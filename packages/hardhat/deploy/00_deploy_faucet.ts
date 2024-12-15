import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "ETHRwandaCommunityFaucetManager" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployETHRwandaCommunityFaucetManager: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const dev = "0xa0c03bE2Cf62f171e29e0d8766677cF4c50d58F8";
  const VERSION = 1;
  const ETH_RWANDA_HACKER_ONBOARD_ADDRESS = "0x6a36A9F5aDF57655E8806bE5675C8c3Be55F92cF";
  const FAUCET_ADDRESS = "0xd443188B33a13A24F63AC3A49d54DB97cf64349A";
  /**
   * npx hardhat verify --network base --api-url https://blockscout.com/base/mainnet/api <DEPLOYED_CONTRACT_ADDRESS> <CONSTRUCTOR_ARGUMENTS>
   * yarn verify --network base --api-url https://api.basescan.org/api 0x5f41c714a2Bf4f8Fe1CF708fE1d6C2b051CB06f9 0xa0c03bE2Cf62f171e29e0d8766677cF4c50d58F8 1 0x6a36A9F5aDF57655E8806bE5675C8c3Be55F92cF 0xd443188B33a13A24F63AC3A49d54DB97cf64349A
   * yarn verify --network base --api-url https://blockscout.com/base/mainnet/api 0x5f41c714a2Bf4f8Fe1CF708fE1d6C2b051CB06f9 0xa0c03bE2Cf62f171e29e0d87666677cF4c50d58F8 1 0x6a36A9F5aDF57655E8806bE5675C8c3Be55F92cF 0xd443188B33a13A24F63AC3A49d54DB97cf64349A
   */
  await deploy("ETHRwandaCommunityFaucetManager", {
    from: deployer,
    args: [dev, VERSION, ETH_RWANDA_HACKER_ONBOARD_ADDRESS, FAUCET_ADDRESS],
    log: true,
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const faucetContract = await hre.ethers.getContract<Contract>("ETHRwandaCommunityFaucetManager", deployer);
  console.log("👋 Hello Here's the ETH Rwanda Community Fauctet Manager Address:", await faucetContract.target);
};

export default deployETHRwandaCommunityFaucetManager;

deployETHRwandaCommunityFaucetManager.tags = ["ETHRwandaCommunityFaucetManager"];
