// import { LevelInfoModal } from "./LevelInfoModal";
import { AlertCircle } from "lucide-react";

export function FaucetInfo() {
  return (
    <div className="max-w-3xl mx-auto mb-8 rounded-xl bg-teal-900/40 backdrop-blur-sm border border-teal-700/50 -mt-36">
      <div className="p-6">
        <div className="flex items-start gap-4">
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
                Want to receive more ETH?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
