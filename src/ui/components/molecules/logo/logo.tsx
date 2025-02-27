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
  const mobile = "";
  const backgroundColorClass = color === "white" ? styles.bwhite : styles.bblue;

  return (
    <>
      <Link href={"/"} className={clsx(styles.logoWrapper, colorClass)}>
        <h1 className={clsx(styles.logo, colorClass)}>Brandeis</h1>
        <div className={clsx(styles.bar, backgroundColorClass, mobile)}></div>
        <small
          className="flex flex-col uppercase justify-center leading-tight "
          style={{ fontSize: "0.7rem" }}>
          <span className=""> The Asper Center for</span>
          <span className="">Global Entrepreneurship</span>
        </small>{" "}
      </Link>
    </>
  );
};

export default Logo;
