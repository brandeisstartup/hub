import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import client from "@/lib/contentful";
import {
  CompetitionEntry,
  CompetitionSkeleton
} from "@/types/used/CompetitionTypes";

type CompetitionContextType = {
  competitions: CompetitionEntry[]; // ✅ Store full Contentful entries
  loading: boolean;
};

const CompetitionContext = createContext<CompetitionContextType | undefined>(
  undefined
);

export function CompetitionProvider({ children }: { children: ReactNode }) {
  const [competitions, setCompetitions] = useState<CompetitionEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const response = await client.getEntries<CompetitionSkeleton>({
          content_type: "competitions"
        });

        console.log("🚀 Raw Contentful Competitions:", response.items);

        setCompetitions(response.items); // ✅ Now correctly typed
      } catch (error) {
        console.error("❌ Error fetching competitions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  return (
    <CompetitionContext.Provider value={{ competitions, loading }}>
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
