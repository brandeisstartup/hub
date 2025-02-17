import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

import styles from "./button.module.css";

type Props = {
  label: string;
  color?: string;
  href?: string; // ✅ Accept `href` prop for navigation
  onClick?: () => void; // ✅ Allow custom onClick handler
};

const Button = ({ label, color, href, onClick }: Props) => {
  // Determine the background class based on the color prop
  const bgClass = color === "blue" ? "bg-BrandeisBrand" : "bg-IBSbrand";

  // Common button content
  const buttonContent = (
    <span
      className={`${styles.heroButton} ${bgClass} text-lg text-bold md:text-2xl font-sans hover:underline flex items-center gap-2 px-4 py-2`}>
      {label}
      <ArrowRightIcon className="h-8 hover:underline" />
    </span>
  );

  return href ? (
    // ✅ Use `Link` for navigation if `href` is present
    <Link href={href} className="inline-block">
      {buttonContent}
    </Link>
  ) : (
    // ✅ Use a normal button if no `href` is provided
    <button onClick={onClick}>{buttonContent}</button>
  );
};

export default Button;
