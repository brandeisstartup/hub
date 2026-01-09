import { Entry, EntrySkeletonType } from "contentful";

export interface CompetitionFields {
  title: string;
  showInHub: boolean;
  shortDescription: string;
  navigationDescription: string;
  description: string;
  startDate: string;
  endDate: string;
  isGrant: boolean;
  thumbnail: ImageFile;

  showInSearch: boolean;
  showInNav: boolean;

  ctaButtonLabel: string;
  ctaButtonLink: string;

  heroImage: ImageFile;
  heroSecondaryButtonLabel: string;
  heroSecondaryButtonLink: string;

  introVideoYoutubeId: string;

  about: string;
  aboutLabel: string;

  requirements: Requirement[];

  scheduleLabel: string;
  scheduleEvents: ScheduleItem[];
  scheduleEventsNew: ScheduleItem[];

  winnersYoutubeGridLabel: string;
  winnersYoutubeGrid: YoutubeWinnerItem[];

  personSpotlightLabel: string;
  personSpotlightImage: ImageFile;
  personSpotlightText: string;
  personSpotlightLinkText: string;
  personSpotlightLInk: string;
  personSpotlightFirstName: string;
  personSpotlightLastName: string;

  prizesLabel: string;
  prizes: Prize[];
  raffleMainText: string;
  raffleSubText: string;
  raffleImage: ImageFile;

  pastProjectTitle: string;
  projects: Project[];

  faqs: FAQ[];

  contactInformation: Person[];

  peopleSectionLabel: string;
  people: Person[];

  // Live event configuration
  showLiveInfo: boolean; // when true, event has a live page section
  liveInfoAlwaysVisible?: boolean; // if true, live info is shown even outside event dates
  liveGoogleCalendarId?: string; // optional per-event calendar override
  pitchSummitLiveInfoSheetUrl?: string; // optional Google Sheets link for Pitch Summit specifics
}

export interface FAQ {
  sys: {
    id: string;
  };
  fields: {
    question: string;
    answer: string;
  };
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
export interface YoutubeWinnerItem {
  fields: {
    youtubeId: string;
    overlayText: string;
    topLabel: string;
  };
}
export interface Contact {
  sys: {
    id: string;
  };
  fields: {
    question: string;
    answer: string;
  };
}

export interface Requirement {
  sys: {
    id: string;
  };
  fields: {
    requirement: string;
    explanation: string[];
  };
}

export interface Person {
  sys: {
    id: string;
  };
  fields: {
    firstName: string;
    lastName: string;
    about: string;
    role: string;
    image: ImageFile;
    email?: string;
  };
}

export interface Person {
  fields: {
    firstName: string;
    lastName: string;
    about: string;
    role: string;
    image: ImageFile;
    email?: string;
  };
}

export interface ScheduleItem {
  fields: {
    title: string;
    description: string;
    date: string;
    dateAndTime: string;
  };
}

export interface EventResource {
  fields: {
    title: string;
    contactName: string;
    contactEmail: string;
    href?: string;
    youtube?: string;
  };
}

export interface Prize {
  fields: {
    name: string;
    value: string;
  };
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

export interface Project {
  fields: {
    title: string;
    tagline: string;
    about: string;
    image: ImageFile;
    members: string[];
    videoUrl?: string;
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

export interface ContentfulUser {
  fields: {
    id: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    graduationYear?: number;
    major?: string;
    image?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
  };
}

export interface ProjectFields {
  title: string;
  tagline: string;
  about: string;
  members: string[];
  image: ImageFile;
  teamMembers?: ContentfulUser[];
  video_url?: string;
  videoUrl?: string;
}

/**
 * The typed skeleton for the `projects` content type.
 */
export type Projectskeleton = EntrySkeletonType<ProjectFields, "projects">;

/**
 * A strongly typed Contentful Entry for `projects`.
 */
export type ProjectEntry = Entry<Projectskeleton>;
