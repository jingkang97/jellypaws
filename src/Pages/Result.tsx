import results from "../Data/results.json";

type PersonalityType = keyof typeof results;

export function Result({
  personality,
  onRestart,
}: {
  personality: PersonalityType;
  onRestart: () => void;
}) {
  const data = results[personality];

  return (
    <div className="result-card">
      <h1>
        {data.title} ({data.flavor})
      </h1>

      <h3>Description</h3>
      <ul>
        {data.description.map((desc) => (
          <li key={desc}>{desc}</li>
        ))}
      </ul>

      <h3>Strengths</h3>
      <ul>
        {data.strengths.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h3>Weaknesses</h3>
      <ul>
        {data.weaknesses.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <h3>Jelly Stats</h3>
      <ul>
        <li>Sweetness: {data.stats.sweetness}</li>
        <li>Firmness: {data.stats.firmness}</li>
        <li>Health Rating: {data.stats.healthRating}</li>
      </ul>

      <h3>Most Compatible</h3>
      <ul>
        {data.mostCompatible.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <h3>Least Compatible</h3>
      <ul>
        {data.leastCompatible.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <button onClick={onRestart}>Restart Quiz</button>
    </div>
  );
}
