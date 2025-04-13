import React from "react";
import Image from "next/image";

type RaffleProps = {
  raffleHeading: string;
  raffleSubtext: string;
  raffleImage: string;
};

const Raffle = ({ raffleHeading, raffleSubtext, raffleImage }: RaffleProps) => (
  <div className="mt-16 font-sans">
    <div className="w-full flex flex-row border p-4">
      <div className="w-30 h-30 p-5">
        <Image
          src={`https:${raffleImage}`}
          width={200}
          height={200}
          alt={raffleHeading}
        />
      </div>
      <div className="flex flex-col justify-center m-6">
        <h3 className="text-2xl sm:text-6xl font-sans">{raffleHeading}</h3>
        <p className="text-red-500 font-sans text-xl sm:text-2xl">
          {raffleSubtext}
        </p>
      </div>
    </div>
  </div>
);

export default Raffle;
