"use client";

import { useCompetitions } from "@/context/EventContext";
import { useMergedUser } from "@/context/UserContext";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo, useEffect } from "react";
import { SignInButton, SignedIn, SignedOut, useClerk } from "@clerk/nextjs";

import Logo from "@/ui/components/molecules/logo/logo";
import DropDownButton from "@/ui/components/molecules/dropDownButton/dropDownButton";
import TopBanner from "@/ui/components/contentfulComponents/banner/topBanner";
import UserDropdown from "@/ui/components/organisms/user/UserDropdown";
import { formatDate } from "@/utils";

const findUpcomingEvent = (
  events: { title: string; startDate: string; endDate: string }[],
  daysAhead = 7
) => {
  const today = new Date();
  return (
    events.find((event) => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      const daysUntilStart =
        (startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      const daysUntilEnd =
        (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return daysUntilEnd >= 0 && daysUntilStart < daysAhead;
    }) || null
  );
};

function SignOutButton() {
  const { signOut } = useClerk();
  return (
    <button
      className="text-gray-700 block px-4 py-2 text-sm"
      onClick={() => signOut({ redirectUrl: "/" })}>
      Sign out
    </button>
  );
}

export default function NavBarSearch() {
  const { upcomingEvents, loading } = useCompetitions();
  const { user: mergedUser } = useMergedUser();

  useEffect(() => {
    console.log("Merged User Info:", mergedUser);
  }, [mergedUser]);

  const thisWeekEvent = useMemo(
    () => findUpcomingEvent(upcomingEvents, 7),
    [upcomingEvents]
  );

  const thisWeekBannerMessage = thisWeekEvent
    ? `Happening This Week: ${thisWeekEvent.title}`
    : "Happening This Week!";

  const upcomingLinks = useMemo(() => {
    if (upcomingEvents.length > 0) {
      return upcomingEvents.map((event) => ({
        name: event.title,
        description: event.navigationDescription,
        href: `/events/${event.title.toLowerCase().replace(/\s+/g, "-")}`,
        startDate: formatDate(event.startDate),
        endDate: formatDate(event.endDate)
      }));
    }
    return [
      {
        name: "No upcoming events in the next three months. Please view Events for more",
        description: "",
        href: "/#events"
      }
    ];
  }, [upcomingEvents]);

  const dynamicNavigation = useMemo(
    () => [
      {
        name: "Our Events",
        href: "/#events"
      },
      {
        name: "Upcoming",
        href: "#upcoming",
        links: upcomingLinks
      },
      {
        name: "Student Startups",
        href: "/",
        links: [
          {
            name: "View Projects",
            description: "Browse through all projects",
            href: "/search"
          },
          {
            name: "Add a Project",
            description: "Submit project for display",
            href: "/submissions/project-form"
          }
        ]
      },
      {
        name: "Off-Campus Events",
        href: "/news"
      },
      {
        name: "Help",
        href: "/help"
      }
    ],
    [upcomingLinks]
  );

  // Keep effects minimal to avoid layout coupling.

  return (
    <header>
      <nav className="fixed left-0 right-0 top-0 z-50">
        {!loading && thisWeekEvent && (
          <TopBanner
            message={thisWeekBannerMessage}
            linkLabel="Go to Event"
            event={thisWeekEvent}
          />
        )}

        <Disclosure as="main" className="bg-BrandeisBrand shadow">
          {() => (
            <>
              <div className="mx-auto w-full px-2 sm:px-4 lg:px-8">
                <div className="flex h-[4.3rem] justify-between">
                  {/* Logo */}
                  <div className="flex px-2 lg:px-0">
                    <div className="flex flex-shrink-0 items-center">
                      <Logo />
                    </div>
                  </div>

                  {/* Desktop navigation */}
                  <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                    <div className="hidden lg:ml-6 lg:flex py-3 px-2">
                      {loading ? (
                        <div className="flex space-x-4">
                          {dynamicNavigation.map((_, i) => (
                            <div
                              key={i}
                              className="h-6 w-24 bg-BrandeisBrandShade opacity-50 animate-pulse rounded-md"
                            />
                          ))}
                        </div>
                      ) : (
                        dynamicNavigation.map((item, index) =>
                          item.links ? (
                            <DropDownButton
                              key={item.name}
                              title={item.name}
                              links={item.links}
                            />
                          ) : (
                            <div key={index} className="w-full max-w-md">
                              <div className="relative">
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  className="text-white group inline-flex items-center rounded-md px-3 py-2 font-bold hover:text-white focus:outline-none overflow-hidden">
                                  <span className="truncate max-w-full text-lg">
                                    {item.name}
                                  </span>
                                </Link>
                              </div>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>

                  {/* Mobile menu button */}
                  <div className="flex items-center lg:hidden">
                    <Disclosure.Button
                      className="relative inline-flex items-center justify-center rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                      aria-label="Open main menu">
                      <span className="sr-only">Open main menu</span>
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    </Disclosure.Button>
                  </div>

                  {/* Auth */}
                  <SignedOut>
                    <SignInButton>
                      <div className="flex justify-center items-center">
                        <button className="h-12 hidden lg:flex lg:items-center text-white text-lg font-bold border border-white px-4 py-3 rounded-md hover:bg-white hover:text-black transition">
                          Sign In
                        </button>
                      </div>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="flex justify-center items-center">
                      <UserDropdown>
                        <SignOutButton />
                      </UserDropdown>
                    </div>
                  </SignedIn>
                </div>
              </div>

              {/* Mobile panel */}
              <Disclosure.Panel className="lg:hidden fixed inset-0 z-50 flex flex-col space-y-4 p-4 overflow-y-auto text-white shadow-lg bg-BrandeisBrand">
                <div className="flex flex-row justify-between">
                  <Logo />
                  <Disclosure.Button className="inline-flex items-center rounded-md p-2 text-gray-50 hover:bg-BrandeisBrand hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="sr-only">Close main menu</span>
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  </Disclosure.Button>
                </div>

                {loading ? (
                  <div className="space-y-3 mt-4">
                    {dynamicNavigation.map((_, i) => (
                      <div
                        key={i}
                        className="h-5 w-40 bg-BrandeisBrandShade opacity-50 animate-pulse rounded-md"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {dynamicNavigation.map((item) => (
                      <div key={item.name} className="py-1">
                        {item.links ? (
                          <>
                            <p className="text-gray-50 text-sm font-medium px-2 py-1">{item.name}</p>
                            {item.links.map((link) => (
                              <Disclosure.Button
                                as={Link}
                                key={link.href}
                                href={link.href}
                                className="block py-1 px-4 text-gray-100 text-sm hover:text-white hover:underline">
                                {link.name}
                              </Disclosure.Button>
                            ))}
                          </>
                        ) : (
                          <Disclosure.Button
                            as={Link}
                            href={item.href}
                            className="block py-1 px-2 text-gray-50 hover:text-white hover:underline text-sm font-medium">
                            {item.name}
                          </Disclosure.Button>
                        )}
                      </div>
                    ))}
                    <SignedOut>
                      <div className="py-1 border-t border-gray-700 mt-2">
                        <Disclosure.Button
                          as={Link}
                          href="/sign-in"
                          className="block py-1 px-2 text-gray-50 hover:text-white hover:underline text-sm font-bold">
                          Sign In
                        </Disclosure.Button>
                      </div>
                    </SignedOut>
                  </div>
                )}

                {loading ? (
                  <div className="h-8 w-32 bg-BrandeisBrandShade opacity-50 animate-pulse rounded-md mt-4" />
                ) : null}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </nav>
    </header>
  );
}
