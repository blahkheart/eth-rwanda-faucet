import { ethers } from "ethers";
import { NextApiRequest, NextApiResponse } from "next";
import { arbitrumSepolia, base, baseSepolia, sepolia } from "viem/chains";
import deployedContracts from "~~/contracts/deployedContracts";
import loadEnv from "~~/utils/scaffold-eth/helpers/loadEnv";

const { privateKey, sepoliaRpcUrl, baseRpcUrl, baseSepoliaRpcUrl, arbitrumSepoliaRpcUrl, levelOneAmount } = loadEnv();
const lockAbi = ["function tokenOfOwnerByIndex(address,uint256) external view returns (uint256)"];
const ethAmount = levelOneAmount;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userAddress, networkId } = req.body;

  if (!networkId || !userAddress) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const ethRwandaFaucetManagerAbi = (deployedContracts as any)[base.id].ETHRwandaCommunityFaucetManager.abi;
  const ethRwandaFaucetManagerAddress = (deployedContracts as any)[base.id].ETHRwandaCommunityFaucetManager.address;

  // Create a provider for testnet ETH transferbased on the testnet networkId
  let providerUrl;
  switch (parseInt(networkId)) {
    case baseSepolia.id:
      providerUrl = baseSepoliaRpcUrl;
      break;
    case arbitrumSepolia.id:
      providerUrl = arbitrumSepoliaRpcUrl;
      break;
    case sepolia.id:
      providerUrl = sepoliaRpcUrl;
      break;
    default:
      return res.status(400).json({ error: "Unsupported network" });
  }

  const provider = new ethers.JsonRpcProvider(providerUrl);
  const faucetWallet = new ethers.Wallet(privateKey, provider);

  // Base chain provider for checks
  const baseProvider = new ethers.JsonRpcProvider(baseRpcUrl);
  const baseWallet = new ethers.Wallet(privateKey, baseProvider);
  const faucetManagerContract = new ethers.Contract(
    ethRwandaFaucetManagerAddress,
    ethRwandaFaucetManagerAbi,
    baseWallet,
  );

  try {
    const coolDown = await faucetManagerContract.COOL_DOWN();
    const coolDownToHours = Number(coolDown) / 3600;

    // Check if the address is able to withdraw
    const isAbleToWithdraw = await faucetManagerContract.isAbleToWithdraw(userAddress);
    if (!isAbleToWithdraw) {
      return res.status(400).json({ error: `User is not able to withdraw: wait at least ${coolDownToHours} hours` });
    }

    const firstValidKeyLockAddress = await faucetManagerContract.getFirstValidKeyLockAddress(userAddress);
    if (firstValidKeyLockAddress === ethers.ZeroAddress) {
      return res.status(400).json({ error: "You do not have a ticket to any workshop in the Gallery" });
    }

    const lockContract = new ethers.Contract(firstValidKeyLockAddress, lockAbi, baseProvider);
    const tokenId = await lockContract.tokenOfOwnerByIndex(userAddress, 0);
    const isTokenIdAbleToWithdraw = await faucetManagerContract.isTokenIdAbleToWithdraw(tokenId);
    if (!isTokenIdAbleToWithdraw) {
      return res.status(400).json({ error: `Token ID has been used: wait at least ${coolDownToHours} hours` });
    }

    // Check faucet wallet balance
    const faucetBalance = await provider.getBalance(faucetWallet.address);
    if (faucetBalance <= ethers.parseEther(ethAmount)) {
      return res.status(400).json({ error: "Faucet balance low, try again later or try another network" });
    }

    // Record the withdrawal
    const recordWithdrawalTx = await faucetManagerContract.recordWithdrawal(userAddress, tokenId);
    const receipt = await recordWithdrawalTx.wait();
    if (receipt.status !== 1) {
      return res.status(400).json({ error: "Failed to record ETH request" });
    }

    // Transfer testnet ether to the address
    const tx = await faucetWallet.sendTransaction({
      to: userAddress,
      value: ethers.parseEther(`${ethAmount}`),
    });
    await tx.wait();

    res.status(200).json({
      message: `Successfully sent ${ethAmount} ETH to ${userAddress} with transaction hash: ${tx.hash}`,
      transactionHash: tx.hash,
      success: true,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
