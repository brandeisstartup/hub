import React from "react";
import Heading from "../../brandeisBranding/headings/heading";
import { Requirement } from "@/types/used/CompetitionTypes";

type Props = {
  heading: string;
  requirements: Requirement[];
};

const Requirements = ({ heading, requirements }: Props) => {
  return (
    <section className="" id="reqs">
      <div className="mx-auto max-w-8xl divide-y divide-gray-900/10 px-4 py-24 sm:py-32 lg:px-4 lg:py-22">
        <Heading label={`${heading}`} />
        <dl className="mt-10 space-y-8 divide-y divide-gray-900/10">
          {requirements.map((req, index) => (
            <div key={index} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
              <dt className="font-sans text-xl leading-7 text-gray-900 lg:col-span-5">
                {" "}
                {req.fields.requirement}
              </dt>
              <dd className="mt-4 lg:col-span-7 lg:mt-0">
                <ol className="text-base leading-7 text-gray-600">
                  {req.fields.explanation.map((exp, index) => (
                    <li key={`${exp}-${index}`} className="">
                      {exp}
                    </li>
                  ))}
                </ol>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Requirements;
