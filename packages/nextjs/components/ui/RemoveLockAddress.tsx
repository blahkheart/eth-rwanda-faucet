import { useEffect, useState } from "react";
import { CustomSelect } from "~~/components/ui/CustomSelect";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";


export default function RemoveLockAddress() {
  const [lockAddresses, setLockAddresses] = useState<string[]>([]);
  const [selectedLockAddress, setSelectedLockAddress] = useState<string>("");

  const { data: fetchedLockAddresses } = useScaffoldReadContract({
    contractName: "ETHRwandaCommunityFaucetManager",
    functionName: "getLockAddresses",
  });

  useEffect(() => {
    if (fetchedLockAddresses) {
      setLockAddresses([...fetchedLockAddresses]);
    }
  }, [fetchedLockAddresses]);

  const handleRemoveLock = async () => {
    try {
      await removeLockAddress({
        args: [selectedLockAddress],
        functionName: "removeLock"
       });
      notification.success("Lock address removed successfully");
      setLockAddresses(lockAddresses.filter((address: string) => address !== selectedLockAddress));
    } catch (error) {
      console.error("Error removing lock address:", error);
      notification.error("Failed to remove lock address");
    }
  };
  const { writeContractAsync: removeLockAddress } = useScaffoldWriteContract("ETHRwandaCommunityFaucetManager");

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h4 className=" text-sm font-medium mb-4">Remove Lock Addresses</h4>
      <div className="space-y-4 text-white">
        {lockAddresses.length === 0 ? (
          <p className="text-gray-100 font-bold ">No lock addresses available...</p>
        ) : (
          <>
            <div>
              <CustomSelect
                options={lockAddresses.map(address => ({ value: address, label: address }))}
                selected={selectedLockAddress}
                onChange={setSelectedLockAddress}
              />
            </div>
            <button
              className="w-full h-12 bg-[#83C5BE] hover:bg-[#006D77] text-[#006D77] hover:text-white transition-colors rounded-md font-semibold flex items-center justify-center"
              onClick={handleRemoveLock}
              disabled={!selectedLockAddress}
            >
              Remove Lock
            </button>
          </>
        )}
      </div>
    </div>
  );
}