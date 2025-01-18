
import React from "react";
import styles from "./VideoBox.module.css";

type VideoBoxProps = {
  youtubeUrl: string; // YouTube URL passed to the component
  onClose: () => void;
};

const VideoBox = ({ youtubeUrl, onClose }: VideoBoxProps) => {
  const handleVideoClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents click from bubbling up
  };

  return (
    <div
      className="z-1 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center video-modal"
      onClick={onClose}
    >
      <div className="bg-white p-8 video-content" onClick={handleVideoClick}>
        <button onClick={onClose} className="absolute top-2 right-2 text-lg font-bold">
          &times;
        </button>
        <div className="video-container">
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${new URL(youtubeUrl).searchParams.get("v")}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoBox;

