import { tone } from "../lib/tone.js";

// One small card per category score, with a coloured bar underneath.
function ScoreTile({ label, score }) {
  const t = tone(score);
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${t.text}`}>{score}</p>
      <div className="mt-3 h-2 rounded-full bg-track">
        <div className={`h-2 rounded-full ${t.bar}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

// Takes the scores object ({ Keywords: 80, Skills: 60, ... }) and lays out a tile for each.
export default function ScoreBreakdown({ scores }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Object.entries(scores).map(([label, score]) => (
        <ScoreTile key={label} label={label} score={score} />
      ))}
    </div>
  );
}
