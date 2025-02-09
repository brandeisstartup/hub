import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";

import styles from "./button.module.css";

type Props = {
  label: string;
  color?: string;
  onClick?: () => void; // Optional onClick event handler
};

const Button = ({ label, color, onClick }: Props) => {
  // Determine the background class based on the color prop
  const bgClass = color === "blue" ? "bg-BrandeisBrand" : "bg-IBSbrand";

  return (
    <button
      className={`${styles.heroButton} ${bgClass} text-bold text-2xl font-sans hover:underline `}
      onClick={onClick} // Attach the onClick handler
    >
      {label}
      <span>
        <ArrowRightIcon className="h-8 hover:underline" />
      </span>
    </button>
  );
};

export default Button;
