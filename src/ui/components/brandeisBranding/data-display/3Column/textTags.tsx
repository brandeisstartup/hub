import React from "react";
import Link from "next/link";

import { programs } from "@/config/homeConfig";
import Button from "@/components/brandeisBranding/buttons/link";

type Props = {
  href: string;
};

const textTags = (props: Props) => {
  return (
    <div id={props.href} className="bg-BrandeisBrandGray flex justify-center">
      <div className="wrapper flex flex-col w-full justify-center md:flex-row pt-20 pb-20 px-4 max-w-8xl">
        <div className="heading w-full flex justify-center md:w-[25%]">
          <div className="flex flex-col gap-4 justify-center text-center w-full self-start  ">
            <span className="decoration h-[.5rem] bg-BrandeisBrand w-[4rem] block self-center md:self-start"></span>{" "}
            <h2 className="font-sans text-4xl self-center md:self-start ">
              Programs
            </h2>
          </div>
        </div>
        <div className="grid_container grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:pl-8">
          {programs.map((program) => (
            <section key={program.name} className="w-full flex flex-col mb-6">
              <div className="flex flex-col h-full gap-3">
                <aside>
                  <span className="text-md font-bold text-white bg-IBSbrand px-2 py-1 font-sans">
                    {program.type}
                  </span>
                </aside>
                <Link
                  href={program.href}
                  className="text-2xl font-bold font-sans text-BrandeisBrand mt-2 hover:underline">
                  {program.name}
                </Link>
                <p className="text-body text-BrandeisBodyText">
                  {program.about}
                </p>
              </div>
            </section>
          ))}
          <Button label="Learn More" color="blue" link="/" />
        </div>
      </div>
    </div>
  );
};

export default textTags;
