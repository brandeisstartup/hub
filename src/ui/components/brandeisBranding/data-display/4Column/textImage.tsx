import React, { useState } from "react";
import Image from "next/image";

import Button from "@/components/brandeisBranding/buttons/button";
import Link from "@/components/brandeisBranding/buttons/link";
import Heading from "@/components/brandeisBranding/headings/heading";

// Define a type for individual project entries
type Project = {
  _id: string;
  name: string;
  lastName: string;
  title: string;
  tagline: string;
  content: string;
  teamMembers: string[];
  competition: string[];
  year: string;
  imageUrl: string;
};

// Update the Props type to include an array of projects and the extend flag
type Props = {
  projects: Project[];
  label: string;
  extend?: boolean;
};

const TextImage = ({ projects, label, extend = false }: Props) => {
  const [displayCount, setDisplayCount] = useState(4); // Start with displaying 4 projects

  const loadMoreProjects = () => {
    setDisplayCount((prevCount) => prevCount + 4); // Load 4 more projects each time
  };

  function createProjectUrl(projectName: string) {
    const kebabCaseName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return `/projects/${kebabCaseName}`;
  }
  return (
    <div className="flex justify-center">
      <div className="wrapper flex w-full justify-center flex-col pt-20 pb-20 px-4 max-w-8xl">
        <Heading label={label} />
        <div className="grid_container grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full mt-8">
          {projects
            .slice(0, extend ? displayCount : projects.length)
            .map((project) => (
              <section key={project._id} className="w-full flex flex-col mb-6">
                <div className="flex flex-col h-full gap-3">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={500}
                    height={500}
                  />
                  <a
                    href={createProjectUrl(project.title)}
                    className="text-xl font-bold font-serif text-BrandeisBrand mt-2 hover:underline">
                    {project.title}
                  </a>
                  <p className="text-body4 text-BrandeisBodyText">
                    {project.tagline}
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

export default TextImage;
