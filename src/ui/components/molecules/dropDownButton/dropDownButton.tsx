import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";

type Props = {
  title: string;
  description?: string;
  size?: "small" | "medium" | "large";
  links: any[];
};

export default function DropDownButton(props: Props) {
  const { title, links } = props;
  return (
    <div className="w-full max-w-sm ">
      <Popover className="relative">
        {({}) => (
          <>
            <Popover.Button
              className={`text-white group inline-flex items-center rounded-md px-3 py-2  font-bold hover:text-white focus:outline-none   overflow-hidden`}>
              <span className="truncate max-w-full">{title}</span>
              <ChevronDownIcon
                className={`ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-gray-100`}
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
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-md">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                  <div className="relative flex flex-col gap-8 bg-white p-7 lg:grid-cols-2">
                    {links.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50">
                        <div className="ml-4">
                          <p className="text-lg font-bold text-BrandeisBrand">
                            {item.name}
                          </p>
                          <p className="text-lg text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                  {/* <div className="bg-gray-50 p-4">
                    <a
                      href="##"
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500/50">
                      <span className="flex items-center">
                        <span className="text-sm font-bold text-gray-900">
                          Documentation
                        </span>
                      </span>
                      <span className="block text-sm text-gray-500">
                        Start integrating products and tools
                      </span>
                    </a>
                  </div> */}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
