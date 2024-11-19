const loadEnv = () => {
  const privateKey = process.env.PRIVATE_KEY;
  const infuraApiKey = process.env.INFURA_API_KEY;
  const arbitrumSepoliaRpcUrl = process.env.ARBITRUM_SEPOLIA_RPC_URL;
  const baseRpcUrl = process.env.BASE_RPC_URL;
  const deployedChainId = process.env.DEPLOYED_CHAIN_ID;
  const levelOneAmount = process.env.NEXT_PUBLIC_LEVEL_ONE_AMOUNT;
  const baseSepoliaRpcUrl = process.env.BASE_SEPOLIA_RPC_URL;
  const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;

  if (!privateKey) throw new Error("Missing environment variable PRIVATE_KEY");
  if (!infuraApiKey) throw new Error("Missing environment variable INFURA_API_KEY");
  if (!arbitrumSepoliaRpcUrl) throw new Error("Missing environment variable ARBITRUM_SEPOLIA_RPC_URL");
  if (!baseRpcUrl) throw new Error("Missing environment variable BASE_RPC_URL");
  if (!deployedChainId) throw new Error("Missing environment variable DEPLOYED_CHAIN_ID");
  if (!levelOneAmount) throw new Error("Missing environment variable NEXT_PUBLIC_LEVEL_ONE_AMOUNT");
  if (!baseSepoliaRpcUrl) throw new Error("Missing environment variable BASE_SEPOLIA_RPC_URL");
  if (!sepoliaRpcUrl) throw new Error("Missing environment variable SEPOLIA_RPC_URL");

  return {
    privateKey,
    infuraApiKey,
    arbitrumSepoliaRpcUrl,
    deployedChainId,
    baseRpcUrl,
    levelOneAmount,
    baseSepoliaRpcUrl,
    sepoliaRpcUrl,
  };
};

export default loadEnv;
