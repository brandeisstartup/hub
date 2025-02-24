import React from "react";

type Props = {
  label: string;
  alignStart?: boolean;
};

const Heading = ({ label, alignStart = true }: Props) => {
  return (
    <div className="heading w-full flex justify-center mb-4">
      <div className="flex flex-col gap-4 justify-center text-center w-full self-start">
        <span
          className={`decoration h-[.5rem] bg-BrandeisBrand w-[4rem] block self-start ${
            alignStart ? "md:self-start" : "md:self-center"
          }`}></span>
        <h2
          className={`font-sans text-4xl self-start text-start ${
            alignStart ? "md:self-start" : "md:self-center"
          }`}>
          {label}
        </h2>
      </div>
    </div>
  );
};

export default Heading;
