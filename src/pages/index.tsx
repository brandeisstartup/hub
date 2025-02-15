import { useCompetitions } from "@/context/EventContext";
import YouTubePage from "@/ui/components/organisms/youtube/YouTubePage";
import IbsGrid from "@/ui/components/brandeisBranding/data-display/ibs-grid/IbsGrid";

export default function Home() {
  const { competitions, loading } = useCompetitions();

  return (
    <>
      {!loading && (
        <IbsGrid label="Test" href="#programs" data={competitions} />
      )}

      <YouTubePage />

      {/* <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-BrandeisBrand">
          Contentful Data
        </h1>

        {loading ? (
          <p>Loading competitions...</p>
        ) : (
          <ul className="list-disc">
            {competitions.map((competition, index) => (
              <li key={index} className="mb-4 p-4 border rounded-lg shadow">
                {Object.entries(competition).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-2">
                    <strong className="capitalize">{key}:</strong>
                    <span>{String(value)}</span>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </>
  );
}
