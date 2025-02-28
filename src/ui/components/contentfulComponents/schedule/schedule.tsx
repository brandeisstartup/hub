import React from "react";
import { ScheduleItem } from "@/types/used/CompetitionTypes";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

type Props = {
  heading: string;
  scheduleEvents: ScheduleItem[];
};

// Function to format date
const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  return date.toLocaleString("en-US", {
    // Full weekday name (e.g., "Monday")
    year: "numeric",
    month: "long", // Full month name (e.g., "February")
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true // Ensures AM/PM format
  });
};

const Schedule = ({ heading, scheduleEvents }: Props) => {
  return (
    <section className="mx-auto w-full max-w-8xl p-4 ">
      <Heading label={`${heading}`} />
      <div className="rounded-lg mx-auto mt-10 max-w-8xl" id="dates">
        <div className="w-full  grid  grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {scheduleEvents.map((item, index) => (
            <div
              key={`${item.fields.title}-${index}`}
              className="border border-gray-150 p-4">
              <time
                dateTime={item.fields.dateAndTime}
                className="flex items-center text-lg font-sans leading-6 text-blue-600">
                {formatDateTime(item.fields.dateAndTime)}
                <div className="" aria-hidden="true" />
              </time>
              <p className="font-sans text-lg leading-8 tracking-tight text-gray-900">
                {item.fields.title}
              </p>
              <p className="leading-7 text-gray-600">
                {item.fields.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
