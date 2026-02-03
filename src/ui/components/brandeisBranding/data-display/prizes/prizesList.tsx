import React from "react";
import { Prize } from "@/types/used/CompetitionTypes";

type PrizesListProps = {
  prizes: Prize[];
};

const PrizesList = ({ prizes }: PrizesListProps) => (
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
);

export default PrizesList;
