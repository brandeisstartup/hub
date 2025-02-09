import React from "react";

type Props = {
  YoutubeId: string;
};

const IntroVideo = ({ YoutubeId }: Props) => {
  return (
    <div className="flex justify-center items-center">
      <iframe
        width="888"
        height="500"
        src={`https://www.youtube.com/embed/${YoutubeId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen></iframe>
    </div>
  );
};

export default IntroVideo;
