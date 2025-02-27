import React from "react";

type Props = {
  YoutubeId: string;
};

const IntroVideo = ({ YoutubeId }: Props) => {
  return (
    <div className="mt-5">
      {/* Mobile layout */}
      <div className="flex justify-center items-center lg:hidden">
        <iframe
          className="border-none inset-0 w-full h-[350px] md:h-[500px]"
          src={`https://www.youtube.com/embed/${YoutubeId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      {/* Large screens */}
      <div className=" justify-center items-center hidden lg:flex">
        <iframe
          width="888"
          height="500"
          src={`https://www.youtube.com/embed/${YoutubeId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen></iframe>
      </div>
    </div>
  );
};

export default IntroVideo;
