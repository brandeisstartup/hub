import React from "react";
import Link from "next/link";

import Button from "@/ui/components/brandeisBranding/buttons/link";
import { CompetitionFields } from "@/types/used/CompetitionTypes";

type Props = {
  label: string;
  href: string;
  data: CompetitionFields[];
};

const IbsGrid = ({ label, href, data }: Props) => {
  return (
    <div id={href} className="bg-BrandeisBrandGray flex justify-center">
      <div className="wrapper flex flex-col w-full justify-center md:flex-row pt-20 pb-20 px-4 max-w-8xl">
        <div className="heading w-full flex justify-center md:w-[25%]">
          <div className="flex flex-col gap-4 justify-center text-center w-full self-start  ">
            <span className="decoration h-[.5rem] bg-BrandeisBrand w-[4rem] block self-center md:self-start"></span>{" "}
            <h2 className="font-sans text-4xl self-center md:self-start ">
              {label}
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:pl-8">
          {data.map((program) => (
            <section key={program.title} className="w-full flex flex-col mb-6">
              <div className="flex flex-col h-full gap-3">
                <aside>
                  <span className="text-md font-bold text-white bg-IBSbrand px-2 py-1 font-sans">
                    {program.isGrant ? "Grant" : "Competition"}
                  </span>
                </aside>
                <Link
                  href={program.title}
                  className="text-2xl font-bold font-sans text-BrandeisBrand mt-2 hover:underline">
                  {program.title}
                </Link>
                <p className="text-body text-BrandeisBodyText">
                  {program.description}
                </p>
              </div>
            </section>
          ))}
          <div className="col-span-full flex justify-start md:justify-start mt-4">
            <Button label="Learn More" color="blue" link="/" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IbsGrid;
