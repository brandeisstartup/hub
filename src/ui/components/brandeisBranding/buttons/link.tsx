import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

import styles from "./button.module.css";

type Props = {
  label: string;
  color?: string;
  link: string;
};

const Button = ({ label, color, link }: Props) => {
  // Determine the background class based on the color prop
  const bgClass = color === "blue" ? "bg-BrandeisBrand" : "bg-IBSbrand";

  return (
    <Link
      className={`${styles.heroButton} ${bgClass} text-bold text-2xl font-sans hover:underline`}
      href={link}>
      {label}
      <span>
        <ArrowRightIcon className="h-8" />
      </span>
    </Link>
  );
};

export default Button;
