import React from "react";

type Props = {
  label: string;
  centered?: boolean;
};

const Heading = ({ label, centered = false }: Props) => {
  const position = centered ? "" : "self-start";
  return (
    <div className="heading w-full flex justify-center ">
      <div
        className={`flex flex-col gap-4 justify-center text-center w-full ${position}`}>
        <span
          className={`decoration h-[.5rem] bg-BrandeisBrand w-[4rem] block self-center md:${position}`}></span>{" "}
        <h2 className={`font-sans text-4xl self-center md:${position}`}>
          {label}
        </h2>
      </div>
    </div>
  );
};
{
  /* <div className="heading w-full flex justify-center ">
                <div className="flex flex-col gap-4 justify-center text-center w-full self-start ">
                  <span className="decoration h-[.5rem] bg-BrandeisBrand w-[4rem] block self-center "></span>{" "}
                  <h2 className="font-sans text-4xl self-center  ">Label</h2>
                </div>
              </div> */
}
export default Heading;
