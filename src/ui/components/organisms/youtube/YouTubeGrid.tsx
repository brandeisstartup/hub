import React, { useState } from "react";
import Image from "next/image";

import Button from "@/ui/components/brandeisBranding/buttons/button";
import Link from "@/ui/components/brandeisBranding/buttons/link";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

// Define a type for individual video entries
type YouTubeVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
};

// Update the Props type to include an array of videos and the extend flag
type Props = {
  videos: YouTubeVideo[];
  label: string;
  extend?: boolean;
};

const YouTubeGrid = ({ videos, label, extend = false }: Props) => {
  const [displayCount, setDisplayCount] = useState(4); // Start with displaying 4 videos

  const loadMoreVideos = () => {
    setDisplayCount((prevCount) => prevCount + 4); // Load 4 more videos each time
  };

  function createVideoUrl(videoId: string) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  return (
    <div className="flex justify-center">
      <div className="wrapper flex w-full justify-center flex-col pt-20 pb-20 px-4 max-w-8xl">
        <Heading label={label} />
        <div className="grid_container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full mt-8">
          {videos
            .slice(0, extend ? displayCount : videos.length)
            .map((video) => (
              <section
                key={video.videoId}
                className="w-full flex flex-col mb-6">
                <div className="flex flex-col h-full gap-3">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    width={500}
                    height={500}
                  />
                  <a
                    href={createVideoUrl(video.videoId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl font-bold font-serif text-BrandeisBrand mt-2 hover:underline">
                    {video.title}
                  </a>
                </div>
              </section>
            ))}
        </div>
        {extend && displayCount < videos.length && (
          <Button label="View More" color="blue" onClick={loadMoreVideos} />
        )}

        {!extend && (
          <Link label="View More" color="blue" link="/youtube-videos" />
        )}
      </div>
    </div>
  );
};

export default YouTubeGrid;
