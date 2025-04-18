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
// import UserDropDownItem from "@/ui/components/organisms/user/UserDropDownItem";

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
    // Clicking this button signs out a user
    // and redirects them to the home page "/".
    <button
      className={`
         "text-gray-700 block px-4 py-2 text-sm`}
      onClick={() => signOut({ redirectUrl: "/" })}>
      Sign out
    </button>
  );
}

export default function NavBarSearch() {
  const { competitions, upcomingEvents, loading } = useCompetitions();
  const { user: mergedUser } = useMergedUser();

  // Console log the merged user info when it changes.
  useEffect(() => {
    console.log("Merged User Info:", mergedUser);
  }, [mergedUser]);

  // ✅ Use useMemo to prevent recalculating unless upcomingEvents changes
  const thisWeekEvent = useMemo(
    () => findUpcomingEvent(upcomingEvents, 7),
    [upcomingEvents]
  );

  const competitionsList = useMemo(
    () => competitions.filter((comp) => !comp.isGrant),
    [competitions]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };

  // ✅ Use useMemo to optimize dynamic navigation array
  const dynamicNavigation = useMemo(
    () => [
      {
        name: "Projects",
        href: "/",
        isActive: "/",
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
        name: "Upcoming",
        href: "#upcoming",
        links: upcomingEvents.map((event) => ({
          name: event.title,
          description: event.navigationDescription,
          href: `/events/${event.title.toLowerCase().replace(/\s+/g, "-")}`,
          startDate: formatDate(event.startDate),
          endDate: formatDate(event.endDate)
        }))
      },
      {
        name: "Events",
        href: "#events",
        links: competitionsList.map((comp) => ({
          name: comp.title,
          description: comp.navigationDescription,
          href: `/events/${comp.title.toLowerCase().replace(/\s+/g, "-")}`
        }))
      }
      // {
      //   name: "Articles & Resources",
      //   href: "/resources",
      //   isActive: "/404",
      //   links: [
      //     {
      //       name: "Blog",
      //       description: "Read our latest blog posts and news.",
      //       href: "/blog"
      //     },
      //     {
      //       name: "Articles",
      //       description: "Explore insightful articles and research.",
      //       href: "/articles"
      //     },
      //     {
      //       name: "Help",
      //       description: "Get help and support for your projects.",
      //       href: "/help"
      //     },
      //     {
      //       name: "Funding Resources",
      //       description: "Discover funding opportunities at Brandeis.",
      //       href: "/resources#funding"
      //     },
      //     {
      //       name: "Software Resources",
      //       description: "Access free software and exclusive discounts.",
      //       href: "/resources#software"
      //     }
      //   ]
      // }
    ],
    [upcomingEvents, competitionsList]
  );

  return (
    <header>
      <nav className="sticky top-0 z-50">
        {/* ✅ Show TopBanner only when data is loaded */}
        {!loading && thisWeekEvent && (
          <TopBanner
            message={"Happening This Week!"}
            linkLabel={"Go to Event"}
            event={thisWeekEvent}
          />
        )}
        <Disclosure as="main" className="bg-BrandeisBrand shadow">
          {({ open }) => (
            <>
              <div className="mx-auto w-full px-2 sm:px-4 lg:px-8">
                <div className="flex h-[4.3rem] justify-between">
                  <div className="flex px-2 lg:px-0">
                    <div className="flex flex-shrink-0 items-center">
                      <Logo />
                    </div>
                  </div>
                  <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                    <div className="hidden lg:ml-6 lg:flex py-3 px-2">
                      {loading ? (
                        /* ✅ Skeleton Loaders */
                        <div className="flex space-x-4">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className="h-6 w-24 bg-BrandeisBrand animate-pulse rounded"
                            />
                          ))}
                        </div>
                      ) : (
                        /* ✅ Actual Navigation */
                        dynamicNavigation.map((item) => (
                          <DropDownButton
                            key={item.href + "nav"}
                            title={item.name}
                            links={item.links}
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="flex items-center z-52 lg:hidden">
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-white  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    </Disclosure.Button>
                  </div>

                  {open && (
                    <Disclosure.Panel className="lg:hidden fixed inset-0 z-50  flex flex-col space-y-4 p-4 overflow-y-auto  text-white shadow-lg bg-BrandeisBrand">
                      <div className="flex flex-row justify-between lg:hidden">
                        <div className="flex lg:px-0">
                          <div className="">
                            <Logo />
                          </div>
                        </div>
                        <Disclosure.Button className="relative inline-flex rounded-md p-2 text-gray-50 hover:bg-BrandeisBrand hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close main menu</span>
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                      </div>
                      {dynamicNavigation.map((item) => (
                        <div key={item.href}>
                          <p className="text-lg font-semibold">{item.name}</p>
                          {item.links.map((link) => (
                            <Disclosure.Button
                              as={Link}
                              key={link.href}
                              href={link.href}
                              className="block py-2 text-gray-50 hover:underline w-64 ">
                              {link.name}
                            </Disclosure.Button>
                          ))}
                        </div>
                      ))}
                      <Link
                        href="sign-in"
                        className="text-white text-lg bg-BrandeisBrandShade text-center py-2 rounded-md">
                        Sign In
                      </Link>
                    </Disclosure.Panel>
                  )}
                  <SignedOut>
                    <SignInButton>
                      <div className="flex justify-center items-center ">
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
            </>
          )}
        </Disclosure>
      </nav>
    </header>
  );
}
