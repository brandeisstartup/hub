import { GetStaticProps, GetStaticPaths } from "next";
import {
  CompetitionSkeleton,
  CompetitionFields
} from "@/types/used/CompetitionTypes";
import client from "@/lib/contentful";
import { ParsedUrlQuery } from "querystring";
import Heading from "@/ui/components/brandeisBranding/headings/heading";
import CalendarEventsList from "@/ui/components/googleCalendarComponents/calendar";
import PresentationResources from "@/ui/components/contentfulComponents/presentationResources/presentation-resrouces";
// import Hero from "@/ui/components/brandeisBranding/hero/Hero";

interface LocalCompetitionEntry {
  fields: CompetitionFields;
}

interface Props {
  competition: LocalCompetitionEntry;
}

interface Params extends ParsedUrlQuery {
  slug: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await client.getEntries<CompetitionSkeleton>({
    content_type: "competitions",
    select: ["fields.title"]
  });

  const paths = response.items.map((item: { fields: { title: string } }) => ({
    params: { slug: item.fields.title.replace(/\s+/g, "-").toLowerCase() }
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({
  params
}) => {
  if (!params?.slug) {
    return { notFound: true };
  }
  const response = await client.getEntries<CompetitionSkeleton>({
    content_type: "competitions"
  });

  const competition = response.items.find(
    (item: { fields: { title: string } }) =>
      item.fields.title.replace(/\s+/g, "-").toLowerCase() === params.slug
  );

  if (!competition) {
    return { notFound: true };
  }

  return {
    props: { competition },
    revalidate: 60 // ISR: Regenerate the page every 60 seconds
  };
};

export default function CompetitionPage({ competition }: Props) {
  if (!competition || !competition.fields) {
    return <div>Competition data is not available.</div>;
  }

  return (
    <main className="bg-white">
      {/* <Hero
          heroImage={competition.fields.heroImage.fields.file.url}
          description={competition.fields.description}
          header={competition.fields.title}
          primaryLabel={competition.fields.ctaButtonLabel}
          primaryLink={competition.fields.ctaButtonLink}
          secondaryLabel={competition.fields.heroSecondaryButtonLabel}
          secondaryLink={competition.fields.heroSecondaryButtonLink}
        /> */}
      <div className="mx-auto max-w-8xl px-4 py-24 sm:py-32 lg:px-4 lg:py-12">
        <Heading
          label={`${competition.fields.title} Resources and Live Calendar`}
        />

        {competition.fields.showEventResources &&
          competition.fields.eventResources &&
          competition.fields.eventResourcesLabel && (
            <PresentationResources
              presentations={competition.fields.eventResources}
              label={competition.fields.eventResourcesLabel}
            />
          )}
        <CalendarEventsList
          startDate={competition.fields.startDate}
          endDate={competition.fields.endDate}
        />
      </div>

      <section>
        <div
          className="w-full flex items-center justify-center flex-col mb-20"
          id="groups">
          <div className="max-w-8xl w-full ">
            <div className=" w-full">
              <Heading label={"Groups"} />
            </div>
            <ul
              role="list"
              className="w-full mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {groups.map((group, index) => (
                <li
                  key={index}
                  className="col-span-1 flex rounded-md shadow-sm">
                  <div
                    className={`py-20 flex w-8 flex-shrink-0 items-center justify-center rounded-l-md text-xl font-medium text-white ${group.bgColor}`}>
                    {group.name.match(/\d+/)?.[0]}
                  </div>

                  <div className="flex flex-1 items-center justify-between truncate border rounded-md border-gray-200 bg-white">
                    <div className="flex-1 truncate px-4 py-2 text-sm">
                      <h3>{group.name}</h3>
                      <h4 className="text-xs mt-2">
                        Topic:
                        <br />
                        <span className="">{group.project}</span>
                      </h4>
                      <h4 className="text-xs mb-2 break-normal mt-2">
                        Breakout Space: <br />
                        <span className="">{group.breakOutRoom}</span>
                      </h4>
                      <h4 className="text-xs mb-2">
                        Hub: <br />
                        <span className="">{group.hub}</span>
                      </h4>
                      <h4 className="text-xs mb-2">
                        Feedback Session Round 1: <br />
                        <span className="font-semibold">
                          {group.hubCoordinator}
                        </span>
                        <br />
                        <span className="">{group.hubTimes}</span>
                      </h4>
                      <h4 className="text-xs mb-2">
                        Feedback Session Round 2: <br />
                        <span className="font-semibold">
                          {group.hubCoordinatorTwo}
                        </span>
                        <br />
                        <span className="">{group.hubTimesTwo}</span>
                      </h4>

                      <h4 className="text-xs mb-2">
                        Competition Round: <br />
                        <span className="font-semibold">{group.judge}</span>
                        <br />
                        <span className="font-semibold">{group.judgeRoom}</span>
                        <br />
                        <span className="">4:15pm - 5:10pm</span>
                      </h4>
                      <h4 className="text-xs">Members:</h4>
                      {group.members.map((member, memberIndex) => (
                        <p className="text-xs" key={member + memberIndex}>
                          {memberIndex + 1 + ". "}
                          {member}
                        </p>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="w-full flex items-center justify-center flex-col mb-20"
          id="coordinators">
          <div className="max-w-8xl w-full p-2 xl:p-0 ">
            <div className=" w-full">
              <Heading label={"Coordinator Schedules"} />
            </div>
            <ul
              role="list"
              className="w-full mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {coordinators.map((person, index) => (
                <li
                  key={index}
                  className=" flex flex-col rounded-md shadow-sm t">
                  <div className="flex  flex-col items-center justify-between truncate border rounded-md border-gray-200 bg-white">
                    <div className="flex-1  px-4 py-2 text-lg">
                      <h3>{person.name}</h3>
                    </div>
                    <ul className="flex flex-col">
                      {person.meetings.map((item, index) => (
                        <li className=" mb-2" key={person.name + item.place}>
                          <b className="bold">Feedback Session {index + 1}</b>
                          <br />
                          Location: {item.place}
                          <br />
                          Time: {item.times}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="w-full flex items-center justify-center flex-col mb-20"
          id="judgess">
          <div className="max-w-8xl w-full p-2 xl:p-0 ">
            <div className=" w-full">
              <Heading label={"Judge Schedules"} />
            </div>
            <ul
              role="list"
              className="w-full mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {judgetimes.map((person, index) => (
                <li
                  key={index}
                  className=" flex flex-col rounded-md shadow-sm t">
                  <div className="flex  flex-col items-center justify-between truncate border rounded-md border-gray-200 bg-white">
                    <div className="flex-1  px-4 py-2 text-lg">
                      <h3>{person.judge}</h3>
                    </div>
                    <ul className="flex flex-col">
                      <li
                        className=" mb-2"
                        key={person.judge + person.judgeRoom}>
                        Location: {person.judgeRoom}
                        <br />
                        Time: {person.time}
                      </li>
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

const competitionRound = "4:45pm - 5:10pm";

const coordinators = [
  {
    name: "Antonie Knoppers",
    meetings: [
      {
        place: "Lee Hall",
        times: "1:30pm -3:00pm"
      },
      {
        place: "Classroom 55",
        times: "3:05pm - 4:35pm"
      }
    ]
  },
  {
    name: "Bob Walsh",
    meetings: [
      {
        place: "Classroom 55",
        times: "1:30pm -3:00pm"
      },
      {
        place: "Lee Hall",
        times: "3:05pm - 4:35pm"
      }
    ]
  },
  {
    name: "Alice Ain Rich",
    meetings: [
      {
        place: "International Hall",
        times: "1:30pm - 3:00pm"
      },
      {
        place: "Classroom 54",
        times: "3:05pm - 4:35pm"
      }
    ]
  },
  {
    name: "Robert Malenfant",
    meetings: [
      {
        place: "Classroom 54",
        times: "1:30pm - 3:00pm"
      },
      {
        place: "International Hall",
        times: "3:05pm - 4:35pm"
      }
    ]
  }
];
const judgetimes = [
  {
    judge: "Elan Kawesch",
    judgeRoom: "International Hall",
    time: competitionRound
  },
  {
    judge: "Alyson B. Popper",
    judgeRoom: "Lee Hall",
    time: competitionRound
  },
  {
    judge: "Julie Miller",
    judgeRoom: "Lemberg 55",
    time: competitionRound
  },
  {
    judge: "Kimberly Airasian",
    judgeRoom: "Chancellor's Suite",
    time: competitionRound
  },
  {
    judge: "Prof. Philippe Wells",
    judgeRoom: "Dean's Conference Room",
    time: competitionRound
  }
];

const groups = [
  {
    name: "Group 1",
    project: "Checklist",
    members: ["Sam Bae", "Munkhbold Bayarkhuu", "runxiang cao", "Ann Chen"],
    bgColor: "bg-red-600",
    breakOutRoom: "Outside OASSE",
    hubCoordinator: "Antonie Knoppers",
    hubCoordinatorTwo: "Bob Walsh",
    hubTimes: "1:30pm & 2:15pm",
    hubTimesTwo: "3:05pm & 3:50pm",
    hub: "Lee Hall",
    judge: "Elan Kawesch",
    judgeRoom: "International Hall"
  },
  {
    name: "Group 2",
    project: "Checklist",
    members: ["Elijah Benson", "Shanyi Chen", "Jacob Friedman", "Nora Elbasha"],
    bgColor: "bg-blue-600",
    breakOutRoom: "Dean Conference Room",
    hubCoordinator: "Antonie Knoppers",
    hubCoordinatorTwo: "Bob Walsh",
    hubTimes: "1:50pm & 2:35pm",
    hubTimesTwo: "3:25pm & 4:10pm",
    hub: "Lee Hall",
    judge: "Elan Kawesch",
    judgeRoom: "International Hall"
  },

  {
    name: "Group 4",
    project: "ComUniversity",
    members: ["Hercules Zhang", "Jace Guo", "Kamila Haieva"],
    bgColor: "bg-yellow-600",
    breakOutRoom: "Chancellor’s Suite",
    hubCoordinator: "Alice Ain Rich",
    hubCoordinatorTwo: "Robert Malenfant",
    hubTimes: "1:30pm & 2:15pm",
    hubTimesTwo: "3:05pm & 3:50pm",
    hub: "International Hall",
    judge: "Alyson B. Popper",
    judgeRoom: "Lee Hall"
  },
  {
    name: "Group 5",
    project: "ComUniversity",
    members: ["Jasmine Huang", "Ranjith K", "Maria Koraicho"],
    bgColor: "bg-purple-600",
    breakOutRoom: "Private Study Suite (next to Chancellor)",
    hubCoordinator: "Alice Ain Rich",
    hubCoordinatorTwo: "Robert Malenfant",
    hubTimes: "1:45pm & 2:30pm",
    hubTimesTwo: "3:20pm & 4:05pm",
    hub: "International Hall",
    judge: "Alyson B. Popper",
    judgeRoom: "Lee Hall"
  },
  {
    name: "Group 6",
    project: "BIBS",
    members: ["David Lee", "Shunuan Li", "Kelsey Lin"],
    bgColor: "bg-pink-600",
    breakOutRoom: "3rd Floor Back Hallway",
    hubCoordinator: "Alice Ain Rich",
    hubCoordinatorTwo: "Robert Malenfant",
    hubTimes: "2:00pm & 2:45pm",
    hubTimesTwo: "3:35pm & 4:20pm",
    hub: "International Hall",
    judge: "Julie Miller",
    judgeRoom: "Lemberg 55"
  },
  {
    name: "Group 7",
    project: "BIBS",
    members: [
      "Hannah Liu",
      "Sayasha Luitel",
      "Malleea Mathur",
      "Aniruddha	Dharmadhikari"
    ],
    bgColor: "bg-indigo-600",
    breakOutRoom: "CSE Suite",
    hubCoordinatorTwo: "Alice Ain Rich",
    hubCoordinator: "Robert Malenfant",
    hubTimes: "1:30pm & 2:15pm",
    hubTimesTwo: "3:05pm & 3:50pm",
    hub: "Classroom 54",
    judge: "Julie Miller",
    judgeRoom: "Lemberg 55"
  },

  {
    name: "Group 9",
    project: "Capturé",
    members: ["Bhanu Prakash-Immanni", "Sophia Scribner", "Yllka Sela"],
    bgColor: "bg-teal-600",
    breakOutRoom: "Alumni Common Room",
    hubCoordinatorTwo: "Alice Ain Rich",
    hubCoordinator: "Robert Malenfant",
    hubTimes: "1:50pm & 2:35pm",
    hubTimesTwo: "3:25pm & 4:10pm",
    hub: "Classroom 54",
    judge: "Kimberly Airasian",
    judgeRoom: "Chancellor's Suite"
  },
  {
    name: "Group 10",
    project: "Capturé",
    members: [
      "Hardik Shukla",
      "Erika Williams",
      "Ray Xiong",
      "Presion Schiller"
    ],
    bgColor: "bg-orange-600",
    breakOutRoom: "Cluster (Soffer)",
    hubCoordinator: "Bob Walsh",
    hubCoordinatorTwo: "Antonie Knoppers",
    hubTimes: "1:30pm & 2:15pm",
    hubTimesTwo: "3:05pm & 3:50pm",
    hub: "Classroom 55",
    judge: "Kimberly Airasian",
    judgeRoom: "Chancellor's Suite"
  },
  {
    name: "Group 11",
    project: "Project Insulin",
    members: ["Puja Yadav", "Hannah Henris", "Ian Gachunga", "Jamahl Neal"],
    bgColor: "bg-lime-600",
    breakOutRoom: "Soffer Back Offices",
    hubCoordinator: "Bob Walsh",
    hubCoordinatorTwo: "Antonie Knoppers",
    hubTimes: "1:45pm & 2:30pm",
    hubTimesTwo: "3:20pm & 4:05pm",
    hub: "Classroom 55",
    judge: "Prof. Philippe Wells",
    judgeRoom: "Dean's Conference Room"
  },
  {
    name: "Group 12",
    project: "Project Insulin",
    members: ["Xi Yu", "Jaber Qadery", "Hengye Li", "Edgar Garcia"],
    bgColor: "bg-cyan-600",
    breakOutRoom: "Study Room (next to Wasserman)",
    hubCoordinator: "Bob Walsh",
    hubCoordinatorTwo: "Antonie Knoppers",
    hubTimes: "2:00pm & 2:45pm",
    hubTimesTwo: "3:35pm & 4:20pm",
    hub: "Classroom 55",
    judge: "Prof. Philippe Wells",
    judgeRoom: "Dean's Conference Room"
  }
];
