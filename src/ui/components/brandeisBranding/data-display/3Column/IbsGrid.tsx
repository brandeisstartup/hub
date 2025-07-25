import React from "react";
import Link from "next/link";
import slugify from "slugify";

import { CompetitionFields } from "@/types/used/CompetitionTypes";
import Heading from "../../headings/heading";
import { formatDate } from "@/utils";

type Props = {
  label: string;
  href: string;
  data: CompetitionFields[];
  // showButton?: boolean;
  // buttonLabel?: string;
  // buttonLink?: string;
};

const IbsGrid = ({
  // showButton,
  // buttonLabel,
  // buttonLink,
  label,
  href,
  data
}: Props) => {
  return (
    <div id={href} className="bg-white flex justify-center font-sans">
      <div className="wrapper flex flex-col w-full justify-center md:flex-row pt-18 pb-18 px-4 max-w-8xl">
        <div className="heading w-full flex justify-center md:w-[25%]">
          <Heading label={label} />
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 md:mt-0 gap-4 w-full md:pl-8">
          {data.map((program) => (
            <section key={program.title} className="w-full flex flex-col mb-6">
              <div className="flex flex-col h-full gap-3">
                <aside>
                  <dl>
                    <dt className="sr-only">Start Date</dt>
                    <dd aria-label="Start Date">
                      <span className="text-md font-bold text-white bg-IBSbrand px-2 py-1 font-sans">
                        {formatDate(program.startDate)}
                      </span>
                    </dd>
                  </dl>
                </aside>
                <Link
                  href={`/events/${slugify(program.title, { lower: true })}`}
                  className="text-2xl font-bold font-sans text-BrandeisBrand mt-2 hover:underline">
                  {program.title}
                </Link>
                <p className="text-md text-BrandeisBodyText font-sans">
                  {program.shortDescription}
                </p>
              </div>
            </section>
          ))}
          {/* {showButton && buttonLabel && buttonLink && (
            <div className="col-span-full flex justify-start md:justify-start mt-4">
              <Button label={buttonLabel} color="blue" href={buttonLink} />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default IbsGrid;
