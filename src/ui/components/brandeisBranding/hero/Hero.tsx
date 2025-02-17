import React from "react";
import Button from "../buttons/button";

type HeroProps = {
  heroImage: string;
  description: string;
  header: string;
};

const Hero = ({ heroImage, description, header }: HeroProps) => (
  <>
    <section
      className="relative flex items-center justify-center text-white text-center 
                 h-[40vh] md:h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}>
      {/* 🔹 Dark Overlay for Readability (Lower z-index) */}
      <div className="absolute inset-0 bg-black bg-opacity-10 z-0"></div>

      {/* 🔹 Hero Content (Higher z-index to stay above the overlay) */}
      <div className="hidden w-full gap-2 md:flex mt-10 flex-col text-white px-6 max-w-8xl font-sans relative z-10">
        <div className="text-start flex flex-col w-full max-w-5xl">
          <h1 className="text-4xl md:text-6xl">{header}</h1>
          {description && (
            <p className="font-serif mt-4 text-lg md:text-2xl">{description}</p>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <Button label="Learn More" href="/about" color="green" />
        </div>
      </div>
    </section>

    {/* 🔹 Mobile Hero Content (Ensure it's visible as well) */}
    <div className="flex flex-col gap-2 md:hidden mt-10 text-black px-6 max-w-3xl font-sans">
      <h1 className="text-4xl md:text-6xl">{header}</h1>
      {description && (
        <p className=" font-serif mt-4 text-lg md:text-2xl">{description}</p>
      )}
      <div className="flex flex-row gap-2">
        <Button label="Learn More" href="/about" color="green" />
      </div>
    </div>
  </>
);

export default Hero;
