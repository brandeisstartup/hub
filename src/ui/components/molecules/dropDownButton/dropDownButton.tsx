import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

type LinkItem = {
  name: string;
  href: string;
  description?: string;
  startDate?: string;
  endDate?: string;
};

type Props = {
  title: string;
  description?: string;
  size?: "small" | "medium" | "large";
  links: LinkItem[];
};

export default function DropDownButton(props: Props) {
  const { title, links } = props;
  return (
    <div className="w-full max-w-md">
      <Popover className="relative">
        {() => (
          <>
            <Popover.Button className="text-white group inline-flex items-center rounded-md px-3 py-2 font-bold hover:text-white focus:outline-none overflow-hidden">
              <span className="truncate max-w-full text-lg">{title}</span>
              <ChevronDownIcon
                className="ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-gray-100"
                aria-hidden="true"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1">
              <Popover.Panel className="absolute right-0 z-10 mt-3 w-screen max-w-md transform px-4 sm:px-0">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative flex flex-col gap-4 bg-white p-4">
                    {links.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="flex flex-col rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50">
                        <p className="text-lg font-bold text-BrandeisBrand break-words">
                          {item.name}
                        </p>
                        {item.startDate && item.endDate ? (
                          <p className="text-md text-gray-500 break-words">
                            {item.startDate} - {item.endDate}
                          </p>
                        ) : (
                          <p className="text-md text-gray-500 break-words">
                            {item.description}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
