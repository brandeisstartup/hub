import React from "react";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

interface SectionProps {
  title: string;
  heading: string;
  description: string;
}

// Utility function to parse text and wrap URLs with anchor tags
const highlightLinks = (text: string) => {
  const customRegex = /\[([^\]]+)\]"([^"]+)"/g; // Match [label]"url"

  const parts = [];
  let match;
  let lastIndex = 0;

  while ((match = customRegex.exec(text)) !== null) {
    // Push the preceding text
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Push the link as a JSX element
    parts.push(
      <a
        key={parts.length}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline">
        {match[1]}
      </a>
    );

    // Update the lastIndex to move forward
    lastIndex = customRegex.lastIndex;
  }

  // Push the remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

const Section = ({ title, heading, description }: SectionProps) => {
  return (
    <div id={title.toLowerCase()} className="py-24 sm:pt-32">
      <div className="mx-auto max-w-8xl px-4">
        <div className="mx-auto max-w-8xl lg:mx-0">
          <Heading label={heading} />
          <p className="text-center md:text-left mt-6 text-lg leading-8 text-gray-600">
            {highlightLinks(description)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Section;
