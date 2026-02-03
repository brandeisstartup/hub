import React from "react";
import Image from "next/image";

type RaffleProps = {
  raffleHeading: string;
  raffleSubtext: string;
  raffleImage: string;
};

const Raffle = ({ raffleHeading, raffleSubtext, raffleImage }: RaffleProps) => (
  <div className="mt-12 font-sans">
    <div className="w-full flex items-center gap-4 border rounded-lg p-4">
      <div className="p-2">
        <Image
          src={`https:${raffleImage}`}
          width={128}
          height={128}
          alt={raffleHeading}
          className="rounded-md object-contain"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-sans">{raffleHeading}</h3>
        <p className="text-red-500 font-sans text-base md:text-lg">
          {raffleSubtext}
        </p>
      </div>
    </div>
  </div>
);

export default Raffle;
