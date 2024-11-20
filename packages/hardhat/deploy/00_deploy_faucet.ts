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
  const dev = "0xd443188B33a13A24F63AC3A49d54DB97cf64349A";
  const VERSION = 1;
  const ETH_RWANDA_HACKER_ONBOARD_ADDRESS = "0x6a36A9F5aDF57655E8806bE5675C8c3Be55F92cF";
  const FAUCET_ADDRESS = "0xd443188B33a13A24F63AC3A49d54DB97cf64349A";

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
