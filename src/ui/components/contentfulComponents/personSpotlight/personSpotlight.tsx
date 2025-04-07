import React from "react";
import Image from "next/image";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

type Props = {
  firstName: string;
  lastName: string;
  label: string;
  title: string;
  imageUrl: string;
  personSpotlightText: string;
  personSpotlightLInk: string;
};

const PersonSpotlight = ({
  firstName,
  lastName,
  label,
  title,
  imageUrl,
  personSpotlightLInk,
  personSpotlightText
}: Props) => {
  return (
    <section className="bg-white ">
      <div className="mx-auto max-w-8xl px-4">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <Heading label={label} />
        </div>
        <div className=" mt-4  overflow-hidden bg-white  text-center   grid grid-cols-1 md:grid-cols-3 gap-2">
          <Image
            src={`https:${imageUrl}`}
            alt={`https:${title} of ${firstName} ${lastName}`}
            layout="responsive"
            width={100}
            height={100}
            className="h-1/2"
          />
          <div className="col-span-1 md:col-span-2  h-full flex flex-col items-start justify-start px-4 gap-4">
            <p className="text-left ">{personSpotlightText}</p>
            <div className="underline text-orange-500">
              <a target="_blank" href={`${personSpotlightLInk}`}>
                Learn more about
                {" " + firstName} {lastName}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonSpotlight;
