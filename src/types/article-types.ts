import { Entry, EntrySkeletonType } from "contentful";
import { Document } from "@contentful/rich-text-types";

export interface ContentfulUser {
  fields: {
    id: string;
    firstName?: string;
    lastName?: string;
    about?: string;
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
export interface ArticleFields {
  title: string;
  content: Document;
  thumbnail: ImageFile;
  authors: ContentfulUser[];
  type: string;
}

// full skeleton for both paths & props
export type ArticleSkeleton = EntrySkeletonType<ArticleFields, "articles">;
export type ArticleEntry = Entry<ArticleSkeleton>;
