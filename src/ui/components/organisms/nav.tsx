import { useCompetitions } from "@/context/EventContext";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

import Logo from "@/ui/components/molecules/logo/logo";
import DropDownButton from "@/ui/components/molecules/dropDownButton/dropDownButton";

export default function NavBarSearch() {
  const { competitions, loading } = useCompetitions();

  // Filter and categorize competitions
  const grants = competitions.filter((comp) => comp.isGrant);
  const competitionsList = competitions.filter((comp) => !comp.isGrant);

  // Dynamically build navigation
  const dynamicNavigation = [
    {
      name: "Projects",
      href: "/",
      isActive: "/",
      links: [
        {
          name: "View Projects",
          description: "Browse through all projects",
          href: "/search?collection=Projects&query="
        }
        // {
        //   name: "Submit a Project",
        //   description: "Submit your project to the platform",
        //   href: "/projects/postForm"
        // }
      ]
    },
    {
      name: "Grants & Awards",
      href: "#grants",
      links: grants.map((grant) => ({
        name: grant.title,
        description: grant.description,
        href: `/events/${grant.title.toLowerCase().replace(/\s+/g, "-")}`,
        startDate: grant.startDate,
        endDate: grant.endDate
      }))
    },
    {
      name: "Competitions",
      href: "#competitions",
      links: competitionsList.map((comp) => ({
        name: comp.title,
        description: comp.description,
        href: `/events/${comp.title.toLowerCase().replace(/\s+/g, "-")}`,
        startDate: comp.startDate,
        endDate: comp.endDate
      }))
    },
    {
      name: "Resources",
      href: "/resources",
      isActive: "/404",
      links: [
        {
          name: "Funding Resources",
          description: "Find funding resources at Brandeis",
          href: "/resources#funding"
        },
        {
          name: "Community Resources",
          description: "Community resources inside and outside Brandeis",
          href: "/resources#community"
        },
        {
          name: "Patenting Resources",
          description: "Protect your intellectual property",
          href: "/resources#patents"
        },
        {
          name: "Software Resources",
          description: "Free software and discounts for Brandeis students",
          href: "/resources#software"
        }
      ]
    }
  ];

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
                    {!loading &&
                      dynamicNavigation.map((item) => (
                        <DropDownButton
                          key={item.href + "nav"}
                          title={item.name}
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
          </>
        )}
      </Disclosure>
    </nav>
  );
}
