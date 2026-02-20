import React from "react";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import { usePitchSummitLiveInfo } from "@/hooks/usePitchSummitLiveInfo";

interface PitchSummitLiveInfoProps {
  sheetUrl: string;
}

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
    {children}
  </div>
);

/**
 * Component that fetches and displays Pitch Summit live info
 * from a Google Sheet, including groups, coordinators, and judges.
 * Data updates periodically (every 60 seconds).
 */
const PitchSummitLiveInfo: React.FC<PitchSummitLiveInfoProps> = ({ sheetUrl }) => {
  const { data, loading, error } = usePitchSummitLiveInfo(sheetUrl);

  if (!sheetUrl || loading || error) {
    return null;
  }

  const { groups = [], coordinators = [], judges = [], deisHacks = [] } = data || {};

  return (
    <main className="bg-white font-sans">
      {/* DEISHacks Awardees Section */}
      {deisHacks.length > 0 && (
        <section id="deishacks-awardees" className="mb-20">
          <div className="w-full">
            <Heading label="DEISHacks Asper Choice Awardees" />
        
            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {deisHacks.map((awardee, index) => {
                const links = (awardee.links || []).filter(Boolean);

                const getLinkLabel = (link: string, linkIndex: number) => {
                  try {
                    const url = new URL(link);
                    return url.hostname.replace(/^www\./, "");
                  } catch {
                    return `Link ${linkIndex + 1}`;
                  }
                };

                return (
                  <li key={index}>
                    <Card>
                      <div className="flex">
                        <div
                          className="w-3 rounded-l-lg bg-indigo-600"
                          aria-hidden
                        />

                        <div className="p-4 flex-1 space-y-4 font-sans">
                          <div className="space-y-2">
                            <h3 className="text-base font-semibold text-gray-900 font-sans">
                              {awardee.project}
                            </h3>

                            {links.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {links.map((link: string, linkIndex: number) => (
                                  <a
                                    key={link + linkIndex}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100"
                                  >
                                    {getLinkLabel(link, linkIndex)}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>

                          {awardee.members.length > 0 && (
                          <div className="border-t pt-3 font-sans">
                            <p className="text-xs font-semibold text-gray-700 mb-1 font-sans">
                              Team
                            </p>
                            <ul className="space-y-1">
                              {awardee.members.map((member, memberIndex) => {
                                const email = awardee.emails?.[memberIndex];

                                return (
                                  <li
                                    key={`${member}-${memberIndex}`}
                                    className="text-xs text-gray-700 font-sans"
                                  >
                                    <p className="font-medium font-sans">{member}</p>
                                    {email && (
                                      <p className="text-[11px] text-gray-500 break-all font-sans">
                                        {email}
                                      </p>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Groups Section */}
      {groups.length > 0 && (
        <section id="groups" className="mb-20">
          <div className="w-full">
            <Heading label="Groups" />

            <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {groups.map((group, index) => (
                <li key={index}>
                  <Card>
                    <div className="flex">
                      <div
                        className={`w-3 rounded-l-lg ${group.bgColor}`}
                        aria-hidden
                      />

                      <div className="p-4 flex-1 space-y-4">
                        {/* Header */}
                        <div>
                          <h3 className="text-base font-semibold text-gray-900 font-sans">
                            {group.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 font-sans">
                            {group.project}
                          </p>
                        </div>

                        {/* Location Info */}
                        <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                          <div>
                            <span className="text-gray-500 font-sans">Breakout</span>
                            <p className="font-medium font-sans">{group.breakOutRoom}</p>
                          </div>
                          <div>
                            <span className="text-gray-500 font-sans">Hub</span>
                            <p className="font-medium font-sans">{group.hub}</p>
                          </div>
                        </div>

                        {/* Feedback Sessions */}
                        <div className="border-t pt-3 space-y-2 text-xs font-sans">
                          <div>
                            <p className="font-semibold text-gray-700 font-sans">
                              Feedback Session 1
                            </p>
                            <p className="font-sans">{group.hubCoordinator}</p>
                            <p className="text-gray-500 font-sans">{group.hubTimes}</p>
                          </div>

                          <div>
                            <p className="font-semibold text-gray-700 font-sans">
                              Feedback Session 2
                            </p>
                            <p className="font-sans">{group.hubCoordinatorTwo}</p>
                            <p className="text-gray-500 font-sans">{group.hubTimesTwo}</p>
                          </div>
                        </div>

                        {/* Competition */}
                        <div className="border-t pt-3 text-xs font-sans">
                          <p className="font-semibold text-gray-700 font-sans">
                            Competition Round
                          </p>
                          <p className="font-sans">{group.judge}</p>
                          <p className="text-gray-500 font-sans">{group.judgeRoom}</p>
                        </div>

                        {/* Members */}
                        <div className="border-t pt-3 font-sans">
                          <p className="text-xs font-semibold text-gray-700 mb-1 font-sans">
                            Members
                          </p>
                          <ul className="space-y-0.5">
                            {group.members.length > 0 ? (
                              group.members.map((member, memberIndex) => (
                                <li
                                  key={member + memberIndex}
                                  className="text-xs text-gray-600 font-sans"
                                >
                                  {member}
                                </li>
                              ))
                            ) : (
                              <li className="text-xs text-gray-400 font-sans">
                                No members listed
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Coordinators Section */}
      {coordinators.length > 0 && (
        <section id="coordinators" className="mb-20">
          <div className="w-full">
            <Heading label="Coordinator Schedules" />

            <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {coordinators.map((person, index) => (
                <li key={index}>
                  <Card>
                    <div className="p-4 space-y-3">
                      <h3 className="text-lg font-semibold text-gray-900 text-center font-sans">
                        {person.name}
                      </h3>

                      <ul className="space-y-2 text-sm font-sans">
                        {person.meetings.map((item, meetingIndex) => (
                          <li key={meetingIndex}>
                            <p className="font-medium font-sans">
                              Feedback Session {meetingIndex + 1}
                            </p>
                            <p className="text-xs text-gray-600 font-sans">
                              {item.place} · {item.times}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Judges Section */}
      {judges.length > 0 && (
        <section id="judges" className="mb-20">
          <div className="w-full">
            <Heading label="Judge Schedules" />

            <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {judges.map((person, index) => (
                <li key={index}>
                  <Card>
                    <div className="p-4 space-y-2 text-center font-sans">
                      <h3 className="text-lg font-semibold text-gray-900 font-sans">
                        {person.judge}
                      </h3>
                      <p className="text-xs text-gray-600 font-sans">
                        {person.judgeRoom}
                      </p>
                      <p className="text-xs text-gray-500 font-sans">
                        {person.time}
                      </p>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
};

export default PitchSummitLiveInfo;
