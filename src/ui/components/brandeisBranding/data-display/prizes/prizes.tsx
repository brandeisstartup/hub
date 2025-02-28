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
      <div className="mx-auto max-w-8xl px-6 py-24 sm:py-32 lg:px-4 lg:py-16">
        <div className="mx-auto max-w-8xl">
          <Heading label={label} />
          <div className="mt-16">
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-6">
              {prizes.map((prize, index) => (
                <div key={index} className="flex max-w-xs flex-col gap-y-4">
                  <dt className="text-2xl font-sans leading-7 text-gray-600">
                    {prize.fields.name}
                  </dt>
                  <dd className="text-9xl sm:text-7xl md:text-8xl  font-sans tracking-tight text-gray-900">
                    {prize.fields.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          {raffleImage && raffleHeading != "" && raffleSubtext != "" && (
            <div className="mt-16  font-sans">
              <div className="w-full  flex flex-row border  p-4">
                <div className="w-30 h-30 p-5">
                  <Image
                    src={`https:${raffleImage}`}
                    width={"200"}
                    height={"200"}
                    alt=""
                  />
                </div>
                <div className=" flex flex-col justify-center m-6">
                  <h3 className="text-2xl sm:text-6xl font-sans ">
                    {raffleHeading}
                  </h3>
                  <p className="text-red-500 font-sans text-xl sm:text-2xl">
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
