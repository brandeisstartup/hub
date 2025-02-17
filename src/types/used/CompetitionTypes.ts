import { Entry, EntrySkeletonType } from "contentful";

export interface CompetitionFields {
  title: string;
  showInHub: boolean;
  description: string;
  startDate: string;
  endDate: string;
  isGrant: boolean;
  thumbnail: ImageFile;

  showHero: boolean;
  heroImage: ImageFile;
  heroPrimaryButtonLabel: string;
  heroPrimaryButtonLink: string;
  heroSecondaryButtonLabel: string;
  heroSecondaryButtonLink: string;

  showIntroVideo: boolean;
  introVideoYoutubeId: string;

  showAbout: boolean;
  about: string;
  aboutLabel: string;

  showRequirements: boolean;
  requirements: Array<{ requirement: string; explanation: Array<string> }>;

  showSchedule: boolean;
  scheduleLabel: string;
  scheduleEvents: ScheduleItem[];

  showWinnersYoutubeGrid: boolean;
  winnersYoutubeGridLabel: string;
  winnersYoutubeGrid: Array<{
    youtubeUrl: string;
    overlayText: string;
    topLabel: string;
  }>;

  showPersonSpotlight: boolean;
  personSpotlightImage: ImageFile;
  personSpotlightText: string;
  personSpotlightLInk: string;
  personSpotlightFirstName: string;
  personSpotlightLastName: string;

  showPrizes: boolean;
  prizesLabel: string;
  prizesList: Prize[];
  showRaffle: boolean;
  raffleMainText: string;
  raffleSubText: string;
  raffleImage: ImageFile;

  showPastProjects: boolean;
  pastProjectTitle: string;
  projects: Project[];

  showFaq: boolean;
  faqs: Array<{ question: string; answer: string }>;

  showContactInformation: boolean;
  contactInformation: Array<{ name: string; email: string }>;

  showPeople: boolean;
  peopleSectionLabel: string;
  people: Person[];

  showEventResources: boolean;
  eventResourcesLabel: string;
  eventResources: EventResource[];
}

export interface HomePageContent {
  name: string;
  header: string;
  tagline: string;
  showHero: boolean;
  heroImage: ImageFile;
  showAllEventsListBlock: boolean;
  showYoutubeVideos: boolean;
}

export interface Project {
  fields: {
    title: string;
    tagline: string;
    about: string;
    image: ImageFile;
    members: string[];
  };
}

export interface Person {
  fields: {
    firstName: string;
    lastName: string;
    about: string;
    role: string;
    image: ImageFile;
  };
}

export interface ScheduleItem {
  title: string;
  description: string;
  date: string;
  dateTime: string;
}

export interface ScheduleItem {
  title: string;
  description: string;
  date: string;
  dateTime: string;
}

export interface EventResource {
  title: string;
  contactName: string;
  contactEmail: string;
  initials: string;
  href: string;
  youtube: string;
  members: number;
  bgColor: string;
}

export interface Prize {
  name: string;
  value: string;
}
export interface ImageFile {
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
        size: number;
        image: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface Competition {
  fields: CompetitionFields;
}

export interface Props {
  competition: Competition;
}

// Ensure the correct `EntrySkeletonType` with explicit contentTypeId
export type CompetitionSkeleton = EntrySkeletonType<
  CompetitionFields,
  "competitions"
>;

// Define the typed Contentful Entry
export type CompetitionEntry = Entry<CompetitionSkeleton>;
