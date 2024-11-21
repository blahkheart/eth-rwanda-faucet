"use client";

import { useState } from "react";
import Image from "next/image";
import type { NextPage } from "next";
import { arbitrumSepolia, baseSepolia, sepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { Address, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { CustomSelect } from "~~/components/ui/CustomSelect";
import { FaucetInfo } from "~~/components/ui/FaucetInfo";
import RemoveLockAddress from "~~/components/ui/RemoveLockAddress";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useScreenSize } from "~~/hooks/scaffold-eth";
import ethRwandaFaucet from "~~/public/faucet-image.png";
import { notification } from "~~/utils/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const [network, setNetwork] = useState(0);
  const [lockAddress, setLockAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const screenSize = useScreenSize();
  const addressFormat = screenSize === "lg" ? "long" : "short";

  const { data: ownerAddress, isLoading: isOwnerAddressLoading } = useScaffoldReadContract({
    contractName: "ETHRwandaCommunityFaucetManager",
    functionName: "owner",
  });

  const { data: faucetWalletAddress, isLoading: isLoadingFaucetWalletAddress } = useScaffoldReadContract({
    contractName: "ETHRwandaCommunityFaucetManager",
    functionName: "faucetWalletAddress",
  });

  const { writeContractAsync: addLockAddress } = useScaffoldWriteContract("ETHRwandaCommunityFaucetManager");

  const requestTokens = async () => {
    if (!network || !connectedAddress || !isConnected) {
      notification.error("Please select a network or connect your wallet");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(`/api/request-tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ networkId: network, userAddress: connectedAddress }),
      });
      const status = response.status;
      const data = await response.json();
      if (status === 200 || data.success) {
        notification.success(data.message);
      } else {
        notification.error(data.error);
      }
    } catch (error: any) {
      console.error("Error requesting tokens:", error);
      notification.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const networkOptions = [
    { value: "", label: "Choose a network" },
    { value: sepolia.id.toString(), label: sepolia.name },
    { value: arbitrumSepolia.id.toString(), label: arbitrumSepolia.name },
    { value: baseSepolia.id.toString(), label: baseSepolia.name },
  ];

  if (isOwnerAddressLoading || isLoadingFaucetWalletAddress) {
    return (
      <div className="mt-14 flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  const isOwner = ownerAddress === connectedAddress;

  return (
    <div className="min-h-screen bg-[#006D77] flex flex-col items-center justify-center p-4 font-['Montserrat',sans-serif]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap");
      `}</style>
      {/* <NFTDisplay /> */}
      <FaucetInfo />
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-none text-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="flex flex-col lg:flex-row items-center justify-center gap-2 mb-2 lg:mr-6">
            <Image src={ethRwandaFaucet} alt="Faucet image" width={150} height={150} />
            <span className="text-2xl lg:text-4xl font-bold">ETH Rwanda Faucet</span>
          </h1>
          <p className="text-gray-200">Get test tokens for your dApp development</p>
        </div>
        <div className="space-y-6">
          {isConnected ? (
            <>
              <div className="bg-white/20 p-4 rounded-lg text-center flex flex-col items-center">
                <h3 className="text-sm mb-2 text-gray-100 font-thin">Faucet Wallet Address</h3>
                <Address address={faucetWalletAddress} size={"sm"} format={addressFormat} />
              </div>
              <div className="space-y-2">
                <label htmlFor="network" className="block text-sm font-medium">
                  Select Network
                </label>
                <CustomSelect options={networkOptions} selected={network.toString()} onChange={setNetwork} />
              </div>
              <button
                disabled={isLoading}
                className={`w-full h-12 bg-[#83C5BE] hover:bg-[#006D77] text-[#006D77] hover:text-white transition-colors rounded-md font-semibold flex items-center justify-center ${
                  isLoading ? "opacity-50 cursor-not-allowed loading loading-spinner" : ""
                }`}
                onClick={requestTokens}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12a8 8 0 01-8 8m0-16a8 8 0 018 8m-8 0a8 8 0 100 16m0-16a8 8 0 000 16m0-8a3 3 0 110-6 3 3 0 010 6z"
                  />
                </svg>
                Request Tokens
              </button>
            </>
          ) : (
            <div className="flex justify-center">
              <RainbowKitCustomConnectButton />
            </div>
          )}

          {isConnected && isOwner && (
            <div className="border-t border-white/20 mt-6 pt-6">
              <h3 className="text-2xl font-bold mb-4 text-center">Owner Controls</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="gateToken" className="block text-sm font-medium mb-2">
                    Add Lock Address
                  </label>
                  <div className="flex space-x-2">
                    <input
                      id="gateToken"
                      type="text"
                      placeholder="Token Address"
                      className="flex-grow h-12 bg-white/20 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#83C5BE]"
                      value={lockAddress}
                      onChange={e => setLockAddress(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        addLockAddress({
                          functionName: "addLock",
                          args: [lockAddress],
                        })
                      }
                      className="h-12 px-4 bg-[#83C5BE] hover:bg-[#006D77] text-[#006D77] hover:text-white transition-colors rounded-md font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="">
                  <div className="space-y-4">
                    <RemoveLockAddress />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
