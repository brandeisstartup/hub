import React from "react";
import Button from "../buttons/button";

type HeroProps = {
  heroImage: string;
  description: string;
  header: string;
  primaryLabel: string;
  primaryLink: string;
  secondaryLabel?: string;
  secondaryLink?: string;
};

const Hero = ({
  heroImage,
  description,
  header,
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink
}: HeroProps) => (
  <>
    <section
      className="relative flex items-center justify-center text-white text-center 
                 h-[50vh] md:h-[90vh] w-full bg-cover bg-center font-sans"
      style={{ backgroundImage: `url(${heroImage})` }}>
      {/* 🔹 Dark Overlay for Readability (Lower z-index) */}
      <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>

      {/* 🔹 Hero Content (Higher z-index to stay above the overlay) */}
      <div className="hidden w-full gap-2 md:flex mt-10 flex-col text-white px-4 max-w-8xl font-sans relative z-10">
        <div className="text-start flex flex-col w-full max-w-5xl ">
          <h1 className=" text-medium [text-shadow:_2px_2px_2px_rgb(0_0_0_/_90%)] font-sans text-7xl">
            {header}
          </h1>
          {description && (
            <p className="[text-shadow:_2px_2px_2px_rgb(0_0_0_/_90%)]  mt-4 text-lg text-bold w-full max-w-3xl md:text-2xl">
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-row gap-2">
          {primaryLabel && primaryLink && (
            <Button label={primaryLabel} href={primaryLink} color="green" />
          )}
          {secondaryLabel && secondaryLink && (
            <Button label={secondaryLabel} href={secondaryLink} color="blue" />
          )}
        </div>
      </div>
    </section>

    {/* 🔹 Mobile Hero Content (Ensure it's visible as well) */}
    <div className="flex flex-col gap-2 md:hidden mt-10 text-black px-4 max-w-3xl font-sans">
      <h1 className="text-4xl md:text-6xl">{header}</h1>
      {description && (
        <p className="  mt-4 text-lg md:text-2xl">{description}</p>
      )}
      <div className="flex flex-col gap-2">
        {primaryLabel && primaryLink && (
          <Button label={primaryLabel} href={primaryLink} color="green" />
        )}
        {secondaryLabel && secondaryLink && (
          <Button label={secondaryLabel} href={secondaryLink} color="blue" />
        )}
      </div>
    </div>
  </>
);

export default Hero;
