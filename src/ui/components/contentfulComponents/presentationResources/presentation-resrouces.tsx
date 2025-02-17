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
      <div className="max-w-8xl w-full p-2 xl:p-0 ">
        <div className=" w-full">
          <Heading label={label} />
        </div>
        <ul
          role="list"
          className="w-full mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6  md:grid-cols-2 lg:grid-cols-3">
          {presentations.map((project, index) => (
            <li key={index} className="col-span-1 flex rounded-md shadow-sm">
              <div className="flex flex-1 items-center justify-between truncate rounded-r-md border border-gray-200 bg-white">
                <div className="flex-1 truncate px-4 py-2 text-sm">
                  <div className="flex flex-col">
                    <a
                      href={project.href}
                      download
                      className="font-bold mb-2 text-gray-900 hover:text-gray-600">
                      {project.title}
                    </a>
                    <div className="flex flex-row">
                      <p className="text-gray-500 w-[100px]">Contact: </p>
                      <p>{project.contactName}</p>
                    </div>
                    <div className="flex flex-row">
                      <p className="text-gray-500 w-[100px]">Email: </p>

                      <p>{project.contactEmail}</p>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Link
                        href={`${project.youtube}`}
                        target="_blank"
                        className="font-sans flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition">
                        <FaYoutube className="mr-2 w-5 h-5" /> Watch on YouTube
                      </Link>
                      <Link
                        href={project.href}
                        target="_blank"
                        className="font-sans flex items-center justify-center w-full bg-IBSbrand hover:bg-IBSshade text-white font-bold py-2 px-4 rounded-lg transition">
                        <FaFilePowerpoint className="mr-2 w-5 h-5" /> View
                      </Link>
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
