import { useEffect, useState } from "react";
import Image from "next/image";
import { JoinCommunityModal } from "./JoinCommunityModal";
import { Contract, JsonRpcProvider } from "ethers";
import { Info } from "lucide-react";
import { base } from "viem/chains";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const unlockProviderBase = new JsonRpcProvider(`https://rpc.unlock-protocol.com/${base.id}`);
type TicketData = {
  name: string;
  image: string;
  address: string;
};

const NFTImage = ({
  image,
  name,
  address,
  onImageClick,
  isMember,
}: {
  image: string;
  name: string;
  address: string;
  onImageClick: () => void;
  isMember: boolean;
}) => {
  return (
    <div
      key={address}
      className={`bg-gray-50 rounded-lg p-3 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
        !isMember ? "cursor-pointer" : ""
      }`}
      onClick={!isMember ? onImageClick : () => null}
    >
      <Image src={image} alt={name} width={150} height={100} className="w-full h-auto rounded-md mb-2" />
      <p className="text-sm font-semibold text-center text-gray-500">{name}</p>
    </div>
  );
};

export default function NFTDisplay() {
  const { address: userAddress, isConnected } = useAccount();
  const [showInfo, setShowInfo] = useState(true);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingMembership, setIsLoadingMembership] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contractAbi = [
    "function name() public view returns (string)",
    "function getHasValidKey(address _user) external view returns (bool)",
  ];
  const baseUrl = "https://locksmith.unlock-protocol.com/lock";
  const ethRwandaCommunityMembership = "0x53fd39d97a67917a0ef09bae965d2daa641fdd88";

  const { data: lockAddresses, isLoading: isLoadingLockAddresses } = useScaffoldReadContract({
    contractName: "ETHRwandaCommunityFaucetManager",
    functionName: "getLockAddresses",
  });

  useEffect(() => {
    const loadEvents = async () => {
      if (lockAddresses && lockAddresses.length) {
        setIsLoadingEvents(true);
        try {
          const workshopsDataPromises = lockAddresses.map(async (address: string) => {
            const eventContract = new Contract(address, contractAbi, unlockProviderBase);
            const name = await eventContract.name();
            return { name, image: `${baseUrl}/${address}/icon`, address };
          });
          const workshopsData = await Promise.all(workshopsDataPromises);
          setTickets(workshopsData);
        } catch (error) {
          console.error("Failed to fetch lock addresses:", error);
        } finally {
          setIsLoadingEvents(false);
        }
      }
    };
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockAddresses]);

  useEffect(() => {
    if (isConnected && userAddress) {
      setIsLoadingMembership(true);
      const membershipStatus = async () => {
        try {
          const membershipContract = new Contract(ethRwandaCommunityMembership, contractAbi, unlockProviderBase);
          const hasValidKey = await membershipContract.getHasValidKey(userAddress);
          setIsMember(hasValidKey);
        } catch (error) {
          console.error("Failed to fetch membership status:", error);
        } finally {
          setIsLoadingMembership(false);
        }
      };
      membershipStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, userAddress]);

  if (!isLoadingLockAddresses && !isLoadingMembership && !isLoadingEvents && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center -mt-64 text-white">
        <h1 className="text-2xl font-bold">No workshops found...</h1>
      </div>
    );
  }

  if (isLoadingLockAddresses || isLoadingEvents || isLoadingMembership) {
    return (
      <div className="flex justify-center -mt-64 text-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#006D77]">
      <div className="flex items-center justify-center mb-6 w-full">
        <h2 className="text-2xl font-bold text-gray-100 text-center flex justify-center">
          <span>Required Workshop NFTs</span>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-100 hover:text-gray-400 transition-colors ml-3"
            aria-label="Toggle information"
          >
            <Info size={24} />
          </button>
        </h2>
      </div>

      {showInfo && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md text-sm text-blue-800">
          To access the faucet, you must own at least one of the following NFTs. These NFTs are awarded for being an
          active community member, or attending our developer workshops and events.
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tickets.map(nft => (
          <>
            {isMember ? (
              <NFTImage
                key={nft.address}
                name={nft.name}
                image={nft.image}
                address={nft.address}
                isMember={isMember}
                onImageClick={handleImageClick}
              />
            ) : (
              <NFTImage
                key={nft.address}
                name={nft.name}
                image={nft.image}
                address={nft.address}
                isMember={isMember}
                onImageClick={handleImageClick}
              />
            )}
          </>
        ))}
      </div>
      {isModalOpen && <JoinCommunityModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}
