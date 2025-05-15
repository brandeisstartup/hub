export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  imageUrl?: string;
  graduationYear?: number;
  major?: string;
}

export interface FlattenedContentfulFields {
  title: string;
  tagline?: string;
  about?: string;
  members?: string[];
  competition?: string | null;
  videoUrl?: string;
  image?: { fields: { file: { url: string } } };
  createdAt: string;
  year: number;
}

export interface GraphQLProject {
  id: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  created_date?: string;
  teamMembers?: User[];
  video_url?: string;
  image_url?: string;
}

export interface ProjectData {
  id?: string;
  title: string;
  tagline?: string;
  about?: string;
  short_description?: string;
  long_description?: string;
  competition?: string;
  created_date?: string;
  createdAt?: string;
  members?: string[];
  teamMembers?: User[];
  video_url?: string;
  imageUrl?: string;
  isContentful?: boolean;
}

export interface SearchPageProps {
  initialProjects: ProjectData[];
}
