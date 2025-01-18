import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import Logo from "@/ui/components/molecules/logo/logo";
import { navigation } from "@/data/navConfig";
import DropDownButton from "@/ui/components/molecules/dropDownButton/dropDownButton";

export default function NavBarSearch() {
  return (
    <nav className="sticky top-0 z-0">
      <Disclosure as="main" className="bg-BrandeisBrand shadow">
        {({ open }) => (
          <>
            <div className="mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex h-16 justify-between">
                <div className="flex px-2 lg:px-0">
                  <div className="flex flex-shrink-0 items-center">
                    <Logo />
                  </div>
                </div>
                <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                  <div className="hidden lg:ml-6 lg:flex py-3 px-2">
                    {navigation.map((item) => (
                      <DropDownButton
                        key={item.href + "nav"}
                        title={item.name}
                        description={item.href}
                        links={item.links}
                      />
                    ))}
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center lg:hidden">
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                {/* Simple Sign In Button */}
                <div className="hidden lg:ml-4 lg:flex lg:items-center">
                  <Link
                    href="#"
                    className="text-white font-bold border border-white px-4 py-2 rounded-md hover:bg-white hover:text-black transition">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <Disclosure.Panel className="lg:hidden">
              <div className="space-y-1 pb-3 bg-white">
                {navigation.map((item) => (
                  <div key={item.name + "static-sublink"}>
                    <div className="block border-t-solid border-t-2 pt-4 py-2 pl-3 pr-4 text-base font-black text-gray-900">
                      {item.name}
                    </div>
                    {item.links && item.links.length > 0 && (
                      <div className="pl-2 py-2 space-y-1">
                        {item.links.map((sublink) => (
                          <Disclosure.Button
                            as="a"
                            key={sublink.href + "static-sublink-mobile"}
                            href={sublink.href}
                            className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-900 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800">
                            {sublink.name}
                          </Disclosure.Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Sign In Button */}
              <div className="border-t border-gray-200 pb-3 pt-4 bg-white">
                <div className="ml-4">
                  <Link
                    href="#"
                    className="block text-center text-base font-medium text-gray-900 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition">
                    Sign In
                  </Link>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </nav>
  );
}
