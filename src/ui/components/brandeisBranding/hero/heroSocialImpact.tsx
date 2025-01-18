import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ArrowDownCircleIcon,
  ArrowRightIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

import styles from "./hero.module.css";
import Button from "@/components/brandeisBranding/buttons/link";
import { Label } from "@headlessui/react/dist/components/label/label";

type Props = {
  title: string;
  href: string;
  image: string;
  description: string;
  label?: string;
};

const Hero = ({ title, href, image, description, label }: Props) => {
  const [bgImageLoaded, setBgImageLoaded] = useState(false);

  useEffect(() => {
    const bgImage = new window.Image();
    bgImage.src = "/heller_test.webp";
    bgImage.onload = () => setBgImageLoaded(true);
  }, []);

  return (
    <>
      {bgImageLoaded && (
        <>
          <div className="w-full h-12 bg-yellow-300 text-BrandeisBrand text-2xl font-sans font-bold  justify-center align-middle items-center text-center pt-3 pb-3  m-0 ">
            Happening Now - Sunday, Nov 17 2024
          </div>
          <div
            className={`${styles.heroContainer} lg:bg-[url('/heller_test.webp')] bg-cover bg-center`}>
            <Image
              className={`${styles.heroImage} lg:hidden`}
              src={image}
              alt={title}
              width={500}
              height={500}
            />
            <div className={`${styles.shadow} py-8 w-full flex justify-center`}>
              <section
                className={`${styles.heroText} w-full max-w-8xl lg:mt-36`}>
                <h1
                  className={`${styles.heroTitle} text-medium text-title shadow-sm font-sans lg:text-5xl`}>
                  {title}
                </h1>
                <p
                  className={`${styles.heroDescription} font-serif text-lg text-bold w-full max-w-3xl md:text-xl`}>
                  {description}
                </p>
                <aside className={`${styles.heroLinks}`}>
                  <Button
                    label={label ? label : "Learn More"}
                    color="green"
                    link={href}
                  />
                  {/* <Link
                  className={`${styles.heroButton} text-bold text-xl font-sans`}
                  href={"/"}>
                  View Projects & Orgs{" "}
                  <span>
                    {" "}
                    <ArrowDownCircleIcon className="h-4" />
                  </span>{" "}
                </Link> */}
                </aside>
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Hero;
