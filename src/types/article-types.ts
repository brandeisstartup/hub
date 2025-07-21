import { Entry, EntrySkeletonType } from "contentful";
import { Document } from "@contentful/rich-text-types";

export interface ArticleFields {
  title: string;
  content: Document;
}

// full skeleton for both paths & props
export type ArticleSkeleton = EntrySkeletonType<ArticleFields, "articles">;
export type ArticleEntry = Entry<ArticleSkeleton>;
