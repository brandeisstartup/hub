import React from "react";

type Props = {
    label: string;
};

const Heading = ({label}:Props) => {
  return (
    <div className="heading w-full flex justify-center ">
      <div className="flex flex-col gap-4 justify-center text-center w-full self-start  ">
        <span className="decoration h-[.5rem] bg-BrandeisBrand w-[4rem] block self-center md:self-start"></span>{" "}
        <h2 className="font-sans text-4xl self-center md:self-start ">{label}</h2>
      </div>
    </div>
  );
};

export default Heading;
