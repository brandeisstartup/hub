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

type CompetitionContextType = {
  competitions: CompetitionFields[]; // All competitions
  upcomingEvents: CompetitionFields[]; // Only events in the next 3 months
  loading: boolean;
};

const CompetitionContext = createContext<CompetitionContextType | undefined>(
  undefined
);

const sortByStartDate = (data: CompetitionFields[]) => {
  return data.sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
};

const sortByTitle = (data: CompetitionFields[]) => {
  return data.sort((a, b) => a.title.localeCompare(b.title));
};

export function CompetitionProvider({ children }: { children: ReactNode }) {
  const [competitions, setCompetitions] = useState<CompetitionFields[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<CompetitionFields[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const response = await client.getEntries<CompetitionSkeleton>({
          content_type: "competitions"
        });

        console.log("🚀 Raw Contentful Competitions:", response.items);
        const formattedCompetitions = response.items.map(
          (entry) => entry.fields
        );
        const data = sortByTitle(formattedCompetitions);
        setCompetitions(data);

        // Compute upcoming events (start date in the next 3 months OR ongoing events)
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Reset to start of the day

        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
        threeMonthsLater.setHours(23, 59, 59, 999); // Set to end of the day

        const filteredUpcoming = data.filter((comp) => {
          if (!comp.startDate) return false; // If no start date, ignore

          const eventStart = new Date(comp.startDate);
          eventStart.setHours(0, 0, 0, 0); // Ensure only date comparison

          const eventEnd = comp.endDate ? new Date(comp.endDate) : null;
          if (eventEnd) eventEnd.setHours(23, 59, 59, 999); // Ensure end date is included till the end of the day

          return (
            (eventStart >= currentDate && eventStart <= threeMonthsLater) || // Future events within 3 months
            (eventEnd && eventEnd >= currentDate) // Ongoing events that have not ended
          );
        });
        const upComingData = sortByStartDate(filteredUpcoming);
        setUpcomingEvents(upComingData);
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
      value={{ competitions, upcomingEvents, loading }}>
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
