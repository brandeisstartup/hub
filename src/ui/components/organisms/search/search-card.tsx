import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";
import React from "react";

export interface ProjectCardProps {
  title: string;
  imageUrl?: string;
  year: string;
  summary: string;
  isLong: boolean;
  isContentful?: boolean;
}

export default function ProjectCard({
  title,
  imageUrl,
  year,
  summary,
  isLong,
  isContentful
}: ProjectCardProps) {
  const slug = isContentful
    ? slugify(title, { lower: true, strict: true })
    : slugify(title, { strict: true });

  return (
    <li className="border hover:bg-gray-100 transition">
      <Link href={`/projects/${slug}`} className="block">
        <div className="flex items-start space-x-4">
          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="96px"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white text-xs font-semibold text-center p-2 bg-gradient-to-br from-blue-800 to-blue-600">
                {title}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mt-2">{title}</h2>
            <span className="text-md text-gray-500">{year}</span>
            <p className="text-md text-gray-700 mt-1">{summary}</p>
            {isLong && (
              <p className="text-blue-500 text-sm hover:underline block">
                Read more
              </p>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}
