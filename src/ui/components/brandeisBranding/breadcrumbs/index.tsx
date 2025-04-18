// components/Breadcrumb.tsx
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/20/solid";
import React from "react";

export type BreadcrumbItem = {
  label: string;
  href?: string; // if present, render as a link
  icon?: React.ReactNode; // e.g. <HomeIcon className="w-5 h-5" />
};

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="inline-flex overflow-hidden rounded-lg border">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center">
              <div
                className={`flex items-center px-4 py-2 ${
                  isLast
                    ? "text-gray-800 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}>
                {item.icon && (
                  <span className="mr-2 flex-shrink-0">{item.icon}</span>
                )}
                {item.href && !isLast ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </div>

              {!isLast && (
                <span className="px-2 text-gray-500 select-none">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
