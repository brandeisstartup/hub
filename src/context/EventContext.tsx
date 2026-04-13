import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import client from "@/lib/contentful";
import {
  CompetitionSkeleton,
  CompetitionFields
} from "@/types/used/CompetitionTypes";
import { parseLocalEndDate, parseLocalStartDate } from "@/utils";

type CompetitionContextType = {
  competitions: CompetitionFields[]; // All competitions
  upcomingEvents: CompetitionFields[]; // Future-only events in the next 3 months
  thisWeekEvents: CompetitionFields[]; // Active now or starting in the next 7 days
  loading: boolean;
};

const CompetitionContext = createContext<CompetitionContextType | undefined>(
  undefined
);

const sortByStartDate = (data: CompetitionFields[]) => {
  return [...data].sort((a, b) => {
    const startDiff =
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    if (startDiff !== 0) return startDiff;
    return a.title.localeCompare(b.title);
  });
};

const sortByTitle = (data: CompetitionFields[]) => {
  return data.sort((a, b) => a.title.localeCompare(b.title));
};

export function CompetitionProvider({ children }: { children: ReactNode }) {
  const [competitions, setCompetitions] = useState<CompetitionFields[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CompetitionFields[]>([]);
  const [thisWeekEvents, setThisWeekEvents] = useState<CompetitionFields[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const response = await client.getEntries<CompetitionSkeleton>({
          content_type: "competitions"
        });
        const formattedCompetitions = response.items.map(
          (entry) => entry.fields
        );
        const data = sortByTitle(formattedCompetitions);
        setCompetitions(data);

        // Compute upcoming events and this-week/active banner events.
        const currentDate = new Date();
        const currentDateStart = new Date(currentDate);
        currentDateStart.setHours(0, 0, 0, 0);

        const currentDateEnd = new Date(currentDate);
        currentDateEnd.setHours(23, 59, 59, 999);

        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        threeMonthsLater.setHours(23, 59, 59, 999);

        const sevenDaysLater = new Date(currentDateStart);
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
        sevenDaysLater.setHours(23, 59, 59, 999);

        const normalizedEvents = data.filter((comp) => {
          if (!comp.startDate) return false; // If no start date, ignore

          return Boolean(comp.endDate);
        });

        const filteredUpcoming = normalizedEvents.filter((comp) => {
          const eventStart = parseLocalStartDate(comp.startDate);

          return eventStart > currentDateEnd && eventStart <= threeMonthsLater;
        });

        const filteredThisWeek = normalizedEvents.filter((comp) => {
          const eventStart = parseLocalStartDate(comp.startDate);
          const eventEnd = parseLocalEndDate(comp.endDate);
          const isActive =
            eventStart <= currentDateEnd && eventEnd >= currentDateStart;
          const startsSoon =
            eventStart >= currentDateStart && eventStart <= sevenDaysLater;

          return isActive || startsSoon;
        });

        setUpcomingEvents(sortByStartDate(filteredUpcoming));
        setThisWeekEvents(sortByStartDate(filteredThisWeek));
      } catch (error) {
        console.error("❌ Error fetching competitions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  return (
    <CompetitionContext.Provider
      value={{ competitions, upcomingEvents, thisWeekEvents, loading }}>
      {children}
    </CompetitionContext.Provider>
  );
}

export function useCompetitions() {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error(
      "useCompetitions must be used within a CompetitionProvider"
    );
  }
  return context;
}
