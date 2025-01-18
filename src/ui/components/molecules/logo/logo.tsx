// import CSS modules
import React from "react";
import styles from "./logo.module.css";
import Link from "next/link";
import clsx from "clsx";

type Props = {
  color?: "white" | "blue";
};

const Logo = ({ color = "white" }: Props) => {
  const colorClass = color === "white" ? styles.white : styles.blue;
  const mobile = "hidden md:flex";
  const smallLogo = "md:hidden";
  const backgroundColorClass = color === "white" ? styles.bwhite : styles.bblue;

  return (
    <>
      <Link href={"/"} className={clsx(styles.logoWrapper, colorClass)}>
        <h1 className={clsx(styles.logo, colorClass)}>Brandeis</h1>
        <div className={clsx(styles.bar, backgroundColorClass, mobile)}></div>
        <small
          className="hidden md:flex flex-col uppercase justify-center leading-tight font-bold"
          style={{ fontSize: "0.48rem" }}>
          <span className="tracking-wide"> The Asper Center for</span>
          <span className="tracking-tighter">Global Entrepreneurship</span>
        </small>{" "}
      </Link>
    </>
  );
};

export default Logo;
