"use client";

import { ScrollArea } from "./ScrollArea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

const levelRequirements = [
  {
    level: 1,
    eth: "0.01",
    requirement: "Must own at least one NFT from the Events Gallery. Basic verification required.",
  },
  {
    level: 2,
    eth: "0.02",
    requirement: "Complete three successful transactions and maintain NFT for 30 days.",
  },
  {
    level: 3,
    eth: "0.05",
    requirement: "Participate in two community events and hold multiple NFTs from different collections.",
  },
  {
    level: 4,
    eth: "0.08",
    requirement:
      "Contribute to the ecosystem through verified development activities and maintain active wallet status.",
  },
  {
    level: 5,
    eth: "0.1",
    requirement: "Achieve recognized developer status and demonstrate consistent platform engagement.",
  },
];

export function LevelInfoModal() {
  return (
    <Dialog>
      <DialogTrigger
        className="text-teal-200 hover:text-teal-100 underline underline-offset-4"
        onClick={() => {
          console.log("triggered");
        }}
      >
        Learn how to level up
      </DialogTrigger>
      <DialogContent className="max-w-md bg-teal-900/95 text-white border-teal-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-teal-200">Faucet Level Requirements</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            {levelRequirements.map(level => (
              <div key={level.level} className="space-y-2">
                <h3 className="text-lg font-semibold text-teal-200">
                  Level {level.level} - {level.eth} ETH/24hrs
                </h3>
                <p className="text-teal-100/90 leading-relaxed">{level.requirement}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
