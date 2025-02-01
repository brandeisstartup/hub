import React from "react";

type Props = {
  youtubeUrl: string; // Added YouTube URL prop
  overlayText: string; // Optional prop for custom text
  topLabel: string;
};

const ResponsiveGridItem = ({ youtubeUrl, overlayText, topLabel }: Props) => {
  return (
    <div className="">
      <div className=" mt-0  mb-0 font-sans flex flex-col justify-center align-middle items-center border shadow-sm">
        <div className="flex flex-col justify-around align-middle items-center gap-0.5 pt-24 pb-24">
          <h5 className="text-2xl text-orange-300">{topLabel}</h5>
          <h4 className="text-4xl text-center max-w-sm ">{overlayText}</h4>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveGridItem;
