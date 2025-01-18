import React, { useState, Children } from "react";
import styles from "./ResponsiveGrid.module.css";
import Heading from "../../headings/heading";
import VideoBox from "../../media/video/VideoBox";

const ResponsiveGrid = ({ children }: { children: React.ReactNode }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const toggleVideo = (url: string | null = null) => {
    setShowVideo(!showVideo);
    setVideoUrl(url);
  };

  // Wrap each child in a div that handles the click event
  const childrenWithProps = Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return (
        <div
          onClick={() => toggleVideo(child.props.youtubeUrl)}
          className="cursor-pointer"
        >
          {child}
        </div>
      );
    }
    return child;
  });

  return (
    <section className="w-full flex flex-col justify-center align-middle py-24 sm:pt-32 pb-32">
      <div className="mx-auto w-full max-w-8xl p-4">
        <Heading label="Winners" />
      </div>
      {showVideo && videoUrl && <VideoBox youtubeUrl={videoUrl} onClose={() => toggleVideo(null)} />}
      <div className={styles.gridContainer}>{childrenWithProps}</div>
    </section>
  );
};

export default ResponsiveGrid;

