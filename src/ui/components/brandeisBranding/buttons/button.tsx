import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";

import styles from "./button.module.css";

type Props = {
  label: string;
  color?: string;
  href?: string; // ✅ Accept `href` prop for navigation
  onClick?: () => void; // ✅ Allow custom onClick handler
  openInNewTab?: boolean;
};

const Button = ({ label, color, href, onClick, openInNewTab = false }: Props) => {
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
    <Link
      href={href}
      className="w-full max-w-[18rem]"
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}>
      {buttonContent}
    </Link>
  ) : (
    // ✅ Use a normal button if no `href` is provided
    <button className="w-full max-w-xs" onClick={onClick}>
      {buttonContent}
    </button>
  );
};

export default Button;
