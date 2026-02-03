import React from "react";
import Image from "next/image";

import { Prize } from "@/types/used/CompetitionTypes";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

type Props = {
  label: string;
  prizes: Prize[];
  raffleHeading: string;
  raffleSubtext: string;
  raffleImage: string;
};

const Prizes = ({
  prizes,
  label,
  raffleHeading,
  raffleImage,
  raffleSubtext
}: Props) => {
  return (
    <section className="bg-white" id="prizes">
      <div className="mx-auto max-w-8xl py-24 sm:py-32 lg:py-16">
        <div className="mx-auto max-w-8xl">
          <Heading label={label} />
          <div className="mt-12">
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-8">
              {prizes.map((prize, index) => (
                <div key={index} className="flex flex-col gap-y-2">
                  <dt className="text-lg md:text-xl font-sans text-gray-700">
                    {prize.fields.name}
                  </dt>
                  <dd className="text-4xl md:text-5xl lg:text-6xl font-sans font-semibold text-gray-900">
                    {prize.fields.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          {raffleImage && raffleHeading != "" && raffleSubtext != "" && (
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
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-sans ">
                    {raffleHeading}
                  </h3>
                  <p className="text-red-500 font-sans text-base md:text-lg">
                    {raffleSubtext}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Prizes;
