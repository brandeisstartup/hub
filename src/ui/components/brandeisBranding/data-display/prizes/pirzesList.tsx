import React from "react";
import { Prize } from "@/types/used/CompetitionTypes";

type PrizesListProps = {
  prizes: Prize[];
};

const PrizesList = ({ prizes }: PrizesListProps) => (
  <div className="mt-16">
    <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-6">
      {prizes.map((prize, index) => (
        <div key={index} className="flex max-w-xs flex-col gap-y-4">
          <dt className="text-2xl font-sans leading-7 text-gray-600">
            {prize.fields.name}
          </dt>
          <dd className="text-9xl sm:text-7xl md:text-8xl font-sans tracking-tight text-gray-900">
            {prize.fields.value}
          </dd>
        </div>
      ))}
    </dl>
  </div>
);

export default PrizesList;
