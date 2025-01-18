export const navigation = [
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
    isActive: "/search",
    links: [
      {
        name: "Ain Family Start-Up Award",
        description: "Next round start spring 2025",
        href: "/challenges/ibs/ainCompetition"
      },

      {
        name: "SparkTank",
        description: "Next round starts winter 2024",
        href: "https://www.brandeis.edu/innovation/grant-programs/spark/index.html"
      }
    ]
  },
  {
    name: "Competitions",
    href: "#competitions",
    isActive: "/search",
    links: [
      {
        name: "Asper Student Awards",
        description: "Next challenge spring 2025",
        href: "/challenges/ibs/asperStudentAwards"
      },
      {
        name: "Pitch Summit",
        description: "Friday, Feb 7 - Saturday, Feb 8 2025",
        href: "/challenges/ibs/pitchSummit"
      },
      {
        name: "Brandeis Social Impact Startup Challenge",
        description: "Next challenge fall 2025",
        href: "/challenges/ibs/socialimpact"
      },
      {
        name: "DeisHacks",
        description: "Next challenge spring 2025",
        href: "https://deishacks.com/"
      }
    ]
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

export const userNavigation = [
  { name: "Settings", href: "/profile/profile" }
  // { name: "Sign out", href: "/api/auth/signout" }
];
