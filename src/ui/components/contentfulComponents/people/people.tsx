import React from "react";
import { Person } from "@/types/used/CompetitionTypes";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Image from "next/image";

type Props = {
  label: string;
  people: Person[];
};

const People = ({ label, people }: Props) => {
  return (
    <section className="bg-white py-24 px- sm:py-32">
      <div className="mx-auto max-w-8xl px-4">
        <Heading label={label} />
        <ul
          role="list"
          className=" font-sans mx-auto mt-20 grid  grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 max-w-7xl justify-center  lg:mx-0 lg:max-w-none  ">
          {people.map((person, index) => (
            <li
              key={index}
              className="flex flex-col max-w-5xl md:flex-row gap-8">
              <Image
                className="w-40 h-40  object-cover"
                src={`https:${person.fields.image.fields.file.url}`}
                alt={person.fields.image.fields.title || "Person image"}
                width={100}
                height={100}
              />
              <div>
                <h3 className=" font-sans text-lg font-semibold leading-8 tracking-tight text-gray-900">
                  {`${person.fields.firstName} ${person.fields.lastName}`}
                </h3>
                <h5 className="text-md text-blue-700">{person.fields.role}</h5>
                <p className=" font-serif text-sm leading-7 text-gray-600">
                  {person.fields.about}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default People;
