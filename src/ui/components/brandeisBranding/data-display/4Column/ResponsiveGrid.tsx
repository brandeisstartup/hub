import React, { useState, Children } from "react";
import styles from "./ResponsiveGrid.module.css";
import Heading from "../../headings/heading";
import VideoBox from "@/ui/components/media/video/VideoBox";

type Props = {
  headingLabel: string;
  children: React.ReactNode;
};

const ResponsiveGrid = ({ headingLabel, children }: Props) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const toggleVideo = (url: string | null = null) => {
    setShowVideo(!showVideo);
    setVideoUrl(url);
  };

  const childrenWithProps = Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return (
        <div
          onClick={() =>
            toggleVideo(
              (child as React.ReactElement<{ youtubeUrl: string }>).props
                .youtubeUrl
            )
          }
          className="cursor-pointer">
          {child}
        </div>
      );
    }
    return child;
  });

  return (
    <section className="w-full flex flex-col justify-center align-middle py-24  sm:pt-32 pb-32">
      <div className="mx-auto w-full max-w-8xl p-4 ">
        <Heading label={headingLabel} />
      </div>
      {showVideo && videoUrl && (
        <VideoBox youtubeUrl={videoUrl} onClose={() => toggleVideo(null)} />
      )}
      <div className={styles.gridContainer}>{childrenWithProps}</div>
    </section>
  );
};

export default ResponsiveGrid;
