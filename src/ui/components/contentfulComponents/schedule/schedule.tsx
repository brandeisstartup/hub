import React from "react";
import { ScheduleItem } from "@/types/used/CompetitionTypes";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

type Props = {
  heading: string;
  scheduleEvents: ScheduleItem[];
};

const Schedule = ({ heading, scheduleEvents }: Props) => {
  return (
    <div className="mx-auto max-w-8xl lg:px-4">
      <Heading label={`${heading}`} />
      <div
        className=" p-20 rounded-lg mx-auto mt-20 max-w-8xl px-6 lg:px-14"
        id="dates">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {scheduleEvents.map((item, index) => (
            <div key={`${item.title}-${index}`}>
              <time
                dateTime={item.dateTime}
                className="flex items-center text-lg font-sans  leading-6 text-blue-600">
                <svg
                  viewBox="0 0 4 4"
                  className="mr-4 h-1 w-1 flex-none"
                  aria-hidden="true">
                  <circle cx={2} cy={2} r={2} fill="currentColor" />
                </svg>
                {item.date} at {item.dateTime}
                <div
                  className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                  aria-hidden="true"
                />
              </time>
              <p className="font-sans mt-6 text-lg  leading-8 tracking-tight text-gray-900">
                {item.title}
              </p>
              <p className="mt-1 leading-7 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
