// import { LevelInfoModal } from "./LevelInfoModal";
import { AlertCircle } from "lucide-react";
import { useScreenSize } from "~~/hooks/scaffold-eth";

export function FaucetInfo() {
  const screenSize = useScreenSize();
  const infoMargin = screenSize === "lg" ? "-mt-22" : "mt-12";

  return (
    <div
      className={`max-w-3xl mx-auto mb-8 rounded-xl bg-teal-900/40 backdrop-blur-sm border border-teal-700/50 ${infoMargin}`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start gap-4">
          <div className="mt-1">
            <AlertCircle className="h-5 w-5 text-teal-200" />
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-teal-200">Faucet Access Requirements</h2>
            <div className="space-y-2 text-teal-100/90">
              <p>
                To use the faucet, you must own at least one NFT from our Events Gallery. At Level 1, you can access
                0.01 ETH every 24 hours.
              </p>
              <p>
                {/* Want to receive more ETH? <LevelInfoModal /> */}
                Want to receive more ETH? <span className="text-gray-100">Info coming soon...</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
