import React from "react";

type HeroProps = {
  heroImage: string;
  description: string;
  header: string;
};

const Hero = ({ heroImage, description, header }: HeroProps) => (
  <section
    className="relative flex items-center justify-center text-white text-center 
                 h-[40vh] md:h-screen w-full bg-cover bg-center"
    style={{ backgroundImage: `url(${heroImage})` }}>
    {/* 🔹 Dark Overlay for Readability */}
    <div className="absolute inset-0 bg-black bg-opacity-10"></div>

    {/* 🔹 Hero Content */}
    <div className="relative z-10 px-6 max-w-3xl font-sans">
      <h1 className="text-4xl md:text-6xl ">{header}</h1>
      {description && (
        <p className="mt-4 text-lg md:text-2xl text-gray-200">{description}</p>
      )}
    </div>
  </section>
);

export default Hero;
