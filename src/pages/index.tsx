import { useCompetitions } from "@/context/EventContext";

export default function Home() {
  const { competitions, loading } = useCompetitions();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-4 text-BrandeisBrand">
        Contentful Data Competitions
      </h1>

      {loading ? (
        <p>Loading competitions...</p>
      ) : (
        <ul className="list-disc">
          {competitions.map((competition) => (
            <li key={competition.sys.id} className="mb-2">
              <strong>{String(competition.fields?.title)}</strong> - Show in
              Hub: {competition.fields?.showInHub ? "Yes" : "No"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
