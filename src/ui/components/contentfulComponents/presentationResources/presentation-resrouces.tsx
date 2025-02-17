import Link from "next/link";
import { FaYoutube, FaFilePowerpoint } from "react-icons/fa"; // Import icons
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import { EventResource } from "@/types/used/CompetitionTypes";

type Props = {
  label: string;
  presentations: EventResource[];
};

const PresentationResources = ({ presentations, label }: Props) => {
  return (
    <div className="w-full flex items-center justify-center flex-col mt-20">
      <div className="max-w-8xl w-full p-2 xl:p-0">
        <div className="w-full">
          <Heading label={label} />
        </div>
        <ul
          role="list"
          className="w-full mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {presentations.map((project, index) => (
            <li key={index} className="col-span-1 flex">
              <div className="flex flex-1 items-center justify-between truncate border border-gray-200 bg-white">
                <div className="flex-1 truncate py-2 text-sm">
                  <div className="flex flex-col font-sans">
                    <h3 className="px-4 font-semibold py-2 text-lg border-b-[1px] mb-2 text-gray-900">
                      {project.title}
                    </h3>
                    <div className="px-4 py-2">
                      <dl className="flex flex-col space-y-2">
                        <div className="flex flex-col">
                          <dt className="w-[100px] font-semibold">Contact:</dt>
                          <dd>{project.contactName}</dd>
                        </div>
                        <div className="flex flex-col">
                          <dt className="w-[100px] font-semibold">Email:</dt>
                          <dd>{project.contactEmail}</dd>
                        </div>
                        <div className="mt-2 flex flex-col">
                          <dt className="w-[100px] font-semibold">Links:</dt>
                          <dd className="flex space-x-2 justify-between pt-2">
                            <Link
                              href={project.youtube}
                              target="_blank"
                              className="py-1 border w-full font-sans flex items-center justify-center hover:text-red-800 text-red-500 font-bold transition">
                              <FaYoutube className="w-8 h-8" />
                            </Link>
                            <Link
                              href={project.href}
                              target="_blank"
                              className="py-1 border w-full font-sans flex items-center justify-center hover:text-IBSShade text-IBSbrand font-bold transition">
                              <FaFilePowerpoint className="w-6 h-6" />
                            </Link>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PresentationResources;
