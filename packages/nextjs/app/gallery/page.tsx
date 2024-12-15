"use client";

import type { NextPage } from "next";
import NFTDisplay from "~~/components/ui/NftDisplay";

const Gallery: NextPage = () => {
  return (
    <div className="min-h-screen bg-[#006D77] flex flex-col items-center justify-center p-4 font-['Montserrat',sans-serif]">
      <NFTDisplay />
    </div>
  );
};

export default Gallery;
