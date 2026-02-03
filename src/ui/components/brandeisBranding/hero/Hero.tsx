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
  isLive?: boolean;
};

const Hero = ({
  heroImage,
  description,
  header,
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink,
  isLive = false
}: HeroProps) => (
  <>
    <section
      className="relative text-white h-[40vh] md:h-[70vh] w-full bg-cover bg-center font-sans"
      style={{ backgroundImage: `url(${heroImage})` }}>
      {/* 🔹 Dark Overlay for Readability (Lower z-index) */}
      <div className="absolute inset-0 bg-black bg-opacity-20 z-0"></div>

      {/* 🔹 Desktop/Tablet Hero Content positioned at bottom; hidden on small screens */}
      <div className="hidden md:absolute md:bottom-0 md:left-0 z-10 pl-4 md:pl-12 pb-8 md:pb-16 md:flex md:flex-col md:items-start md:text-left text-white">
        <div>
          <h1 className="text-4xl md:text-7xl [text-shadow:_2px_2px_2px_rgb(0_0_0_/_90%)] font-sans">
            {header}
          </h1>
          {description && (
            <p className="[text-shadow:_2px_2px_2px_rgb(0_0_0_/_90%)] mt-4 text-lg md:text-2xl max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {isLive ? (
          <div className="mt-4">
            <Button label="See Live Info" href="#live" color="green" />
          </div>
        ) : (
          <div className="mt-4 flex flex-row gap-2">
            {primaryLabel && primaryLink && (
              <Button label={primaryLabel} href={primaryLink} color="green" />
            )}
            {secondaryLabel && secondaryLink && (
              <Button label={secondaryLabel} href={secondaryLink} color="blue" />
            )}
          </div>
        )}
      </div>
    </section>

    {/* 🔹 Mobile Hero Content (visible on small screens; sits below the hero image) */}
    <div className="flex flex-col gap-2 md:hidden mt-10 mb-10 text-black px-4 max-w-3xl font-sans items-start text-left">
      <h1 className="text-4xl md:text-6xl">{header}</h1>
      {description && (
        <p className="  mt-4 text-lg md:text-2xl">{description}</p>
      )}
      {isLive ? (
        <div className="mt-4">
          <Button label="See Live Info" href="#live" color="green" />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {primaryLabel && primaryLink && (
            <Button label={primaryLabel} href={primaryLink} color="green" />
          )}
          {secondaryLabel && secondaryLink && (
            <Button label={secondaryLabel} href={secondaryLink} color="blue" />
          )}
        </div>
      )}
    </div>
  </>
);

export default Hero;
