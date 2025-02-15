import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";

import Button from "@/ui/components/brandeisBranding/buttons/button";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import { CompetitionFields } from "@/types/used/CompetitionTypes";

type Props = {
  projects: CompetitionFields[];
  label: string;
  extend?: boolean;
};

const SimpleImageGrid = ({ projects, label, extend = false }: Props) => {
  const [displayCount, setDisplayCount] = useState(4);

  const loadMoreProjects = () => {
    setDisplayCount((prevCount) => prevCount + 4); // Load 4 more projects each time
  };

  return (
    <div className="flex justify-center">
      <div className="wrapper flex w-full justify-center flex-col pt-20 pb-20 px-4 max-w-8xl">
        <Heading label={label} />
        <div className="grid_container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full mt-8">
          {projects
            .slice(0, extend ? displayCount : projects.length)
            .map((project, index) => (
              <section key={index} className="w-full flex flex-col mb-6">
                <div className="flex flex-col h-full gap-3">
                  <Image
                    src="/philippe_wells.webp"
                    alt={project.title}
                    width={500}
                    height={500}
                  />
                  <Link
                    href={`/events/${slugify(project.title, { lower: true })}`}
                    className="text-xl font-bold font-serif text-BrandeisBrand mt-2 hover:underline">
                    {project.title}
                  </Link>
                  <p className="text-body4 text-BrandeisBodyText">
                    {project.description}
                  </p>
                </div>
              </section>
            ))}
        </div>
        {extend && displayCount < projects.length && (
          <Button label="View More" color="blue" onClick={loadMoreProjects} />
        )}
      </div>
    </div>
  );
};

export default SimpleImageGrid;
