import React from "react";
import Image from "next/image";
import styles from "./ResponsiveGridItem.module.css";

type Props = {
  href: string;
  youtubeUrl: string; // Added YouTube URL prop
  overlayText?: string; // Optional prop for custom text
};

const ResponsiveGridItem = ({ href, youtubeUrl, overlayText = "Learn More" }: Props) => {
  return (
    <div className={styles.imageWrapper}>
      <Image
        src={href}
        alt=""
        layout="fill" // Use 'fill' to make the image cover the container
        objectFit="cover" // Ensures the image covers the div completely
        className="h-full w-full"
      />
      <div className={styles.overlay}>
        <span>{overlayText}</span> {/* Display the overlay text */}
      </div>
    </div>
  );
};

export default ResponsiveGridItem;

