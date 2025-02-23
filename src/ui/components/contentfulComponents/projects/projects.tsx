import React, { useState } from "react";
import Image from "next/image";
import slugify from "slugify";

import { Project } from "@/types/used/CompetitionTypes";
import Button from "@/ui/components/brandeisBranding/buttons/button";
import Link from "@/ui/components/brandeisBranding/buttons/link";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

// Update the Props type to include an array of projects and the extend flag
type Props = {
  projects: Project[];
  label: string;
  extend?: boolean;
};

const Projects = ({ projects, label, extend = false }: Props) => {
  const [displayCount, setDisplayCount] = useState(4); // Start with displaying 4 projects

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
            .map((project) => (
              <section
                key={project.fields.title}
                className="w-full flex flex-col mb-6">
                <div className="flex flex-col h-full gap-3">
                  <Image
                    src={`https:${project.fields.image.fields.file.url}`}
                    alt={project.fields.title}
                    width={500}
                    height={500}
                  />
                  <a
                    href={`/featured/${slugify(project.fields.title, {
                      lower: true
                    })}`}
                    className="text-xl font-bold font-serif text-BrandeisBrand mt-2 hover:underline">
                    {project.fields.title}
                  </a>
                  <p className="text-body4 text-BrandeisBodyText">
                    {project.fields.tagline}
                  </p>
                </div>
              </section>
            ))}
        </div>
        {extend && displayCount < projects.length && (
          <Button label="View More" color="blue" onClick={loadMoreProjects} />
        )}

        {!extend && (
          <Link
            label="View More"
            color="blue"
            link={"/challenges/ibs/ainCompetition"}
          />
        )}
      </div>
    </div>
  );
};

export default Projects;
