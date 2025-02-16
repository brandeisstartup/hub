import React from "react";
import Image from "next/image";

import Heading from "@/ui/components/brandeisBranding/headings/heading";

type Props = {
  prizesList: any[];
};

const prizesArray = [
  {
    name: "First Place",
    value: "$1,500"
  },
  {
    name: "Second Place",
    value: "$1000"
  },
  {
    name: "Third Place",
    value: "$500"
  },
  {
    name: "People’s Choice",
    value: "$500"
  },
  {
    name: "First Place",
    value: "$1,500"
  },
  {
    name: "Second Place",
    value: "$1000"
  },
  {
    name: "Third Place",
    value: "$500"
  }
];

const Prizes = (prizesList: Props) => {
  return (
    <div className="bg-white" id="prizes">
      <div className="mx-auto max-w-8xl px-6 py-24 sm:py-32 lg:px-4 lg:py-16">
        <div className="mx-auto max-w-8xl">
          <Heading label={"Prizes"} />
          <div className="mt-16">
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-6">
              {prizesArray.map((prize) => (
                <div
                  key={prize.name}
                  className="flex max-w-xs flex-col gap-y-4">
                  <dt className="text-2xl font-sans leading-7 text-gray-600">
                    {prize.name}
                  </dt>
                  <dd className="text-9xl sm:text-7xl md:text-8xl  font-sans tracking-tight text-gray-900">
                    {prize.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-16  font-sans">
            <div className="w-full  flex flex-row border  p-4">
              <div className="w-30 h-30 p-5">
                <Image
                  src={"/airpods.webp"}
                  width={"120"}
                  height={"120"}
                  alt=""
                />
              </div>{" "}
              <div className=" flex flex-col justify-center m-6">
                <h3 className="text-2xl sm:text-6xl font-sans ">
                  Apple Airpods MAX Raffle
                </h3>
                <p className="text-red-500 font-sans text-xl sm:text-2xl">
                  Note: Attendance at entire event is required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prizes;
