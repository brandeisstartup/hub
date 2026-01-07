import React from "react";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import Button from "@/ui/components/brandeisBranding/buttons/button";

interface PitchSummitLiveInfoProps {
  sheetUrl: string;
}

/**
 * Placeholder component for Pitch Summit live info.
 * Future: fetch structured data from the provided Google Sheets URL
 * and render Groups, Coordinators, and Judges schedules.
 */
const PitchSummitLiveInfo: React.FC<PitchSummitLiveInfoProps> = ({ sheetUrl }) => {
  if (!sheetUrl) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-8xl px-4">
        <Heading label="Pitch Summit Live Info" />
        <p className="text-gray-700 mb-4 max-w-2xl">
          Live logistics are maintained in a Google Sheet. Open the sheet to view
          current groups, coordinator sessions, and judge schedules.
        </p>
        <div className="max-w-[18rem]">
          <Button label="Open Info Sheet" color="blue" href={sheetUrl} />
        </div>
      </div>
    </section>
  );
};

export default PitchSummitLiveInfo;
