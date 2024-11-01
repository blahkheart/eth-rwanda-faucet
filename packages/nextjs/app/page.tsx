"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { arbitrumSepolia, baseSepolia, sepolia } from "viem/chains";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { CustomSelect } from "~~/components/ui/CustomSelect";

const Home: NextPage = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const [network, setNetwork] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [gateTokenAddress, setGateTokenAddress] = useState("");
  const isOwner = false;
  // Placeholder for blockchain interactions
  const requestTokens = async () => {
    console.log("Tokens requested");
  };

  const createFaucet = async (network: string, amount: string, tokenAddress: string) => {
    console.log("Faucet created", { network, amount, tokenAddress });
  };

  const setTokenGate = async (tokenAddress: string) => {
    console.log("Token gate set", tokenAddress);
  };

  const networkOptions = [
    { value: "", label: "Choose a network" },
    { value: sepolia.id.toString(), label: sepolia.name },
    { value: arbitrumSepolia.id.toString(), label: arbitrumSepolia.name },
    { value: baseSepolia.id.toString(), label: baseSepolia.name },
  ];

  return (
    <div className="min-h-screen bg-[#006D77] flex items-center justify-center p-4 font-['Montserrat',sans-serif]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap");
      `}</style>
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md border-none text-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2 mb-2">
            <svg className="w-8 h-8" viewBox="0 0 784 784" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M392 784C608.5 784 784 608.5 784 392C784 175.5 608.5 0 392 0C175.5 0 0 175.5 0 392C0 608.5 175.5 784 392 784Z"
                fill="#627EEA"
              />
              <path d="M392 98V315.3L578.8 398.2L392 98Z" fill="white" fillOpacity="0.602" />
              <path d="M392 98L205.2 398.2L392 315.3V98Z" fill="white" />
              <path d="M392 537.5V686L579 431.9L392 537.5Z" fill="white" fillOpacity="0.602" />
              <path d="M392 686V537.5L205.2 431.9L392 686Z" fill="white" />
              <path d="M392 503.3L578.8 398.2L392 315.3V503.3Z" fill="white" fillOpacity="0.2" />
              <path d="M205.2 398.2L392 503.3V315.3L205.2 398.2Z" fill="white" fillOpacity="0.602" />
            </svg>
            Ethereum Faucet
          </h1>
          <p className="text-gray-200">Get test tokens for your dApp development</p>
        </div>
        <div className="space-y-6">
          {isConnected ? (
            <>
              <div className="bg-white/20 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Connected Wallet</h3>
                <p className="font-mono">{connectedAddress}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="network" className="block text-sm font-medium">
                  Select Network
                </label>
                <CustomSelect options={networkOptions} selected={network} onChange={setNetwork} />
              </div>
              <button
                className="w-full h-12 bg-[#83C5BE] hover:bg-[#006D77] text-[#006D77] hover:text-white transition-colors rounded-md font-semibold flex items-center justify-center"
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

          {isOwner && (
            <div className="border-t border-white/20 mt-6 pt-6">
              <h3 className="text-2xl font-bold mb-4">Owner Controls</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="gateToken" className="block text-sm font-medium mb-1">
                    Set Token Gate
                  </label>
                  <div className="flex space-x-2">
                    <input
                      id="gateToken"
                      type="text"
                      placeholder="Token Address"
                      className="flex-grow h-12 bg-white/20 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#83C5BE]"
                      value={gateTokenAddress}
                      onChange={e => setGateTokenAddress(e.target.value)}
                    />
                    <button
                      onClick={() => setTokenGate(gateTokenAddress)}
                      className="h-12 px-4 bg-[#83C5BE] hover:bg-[#006D77] text-[#006D77] hover:text-white transition-colors rounded-md font-semibold"
                    >
                      Set
                    </button>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-xl font-semibold mb-4">Create New Faucet</h4>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="newNetwork" className="block text-sm font-medium mb-1">
                        Network Name
                      </label>
                      <input
                        id="newNetwork"
                        type="text"
                        className="w-full h-12 bg-white/20 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#83C5BE]"
                        value={network}
                        onChange={e => setNetwork(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium mb-1">
                        Amount
                      </label>
                      <input
                        id="amount"
                        type="number"
                        className="w-full h-12 bg-white/20 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#83C5BE]"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="tokenAddress" className="block text-sm font-medium mb-1">
                        Token Address
                      </label>
                      <input
                        id="tokenAddress"
                        type="text"
                        className="w-full h-12 bg-white/20 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#83C5BE]"
                        value={tokenAddress}
                        onChange={e => setTokenAddress(e.target.value)}
                      />
                    </div>
                    <button
                      className="w-full h-12 bg-[#83C5BE] hover:bg-[#006D77] text-[#006D77] hover:text-white transition-colors rounded-md font-semibold flex items-center justify-center"
                      onClick={() => createFaucet(network, amount, tokenAddress)}
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Faucet
                    </button>
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
