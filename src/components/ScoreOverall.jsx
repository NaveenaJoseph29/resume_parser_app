import { tone } from "../lib/tone.js";

// The big headline number at the top of the scorecard.
export default function ScoreOverall({ overall, words, matchedCount }) {
  const t = tone(overall);
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-500">Overall match</p>
          <p className="mt-1 text-slate-400">
            {words} words analysed. {matchedCount} job terms found in your resume.
          </p>
        </div>
        <p className={`text-6xl font-extrabold ${t.text}`}>
          {overall}
          <span className="text-2xl text-slate-500">/100</span>
        </p>
      </div>
    </div>
  );
}
