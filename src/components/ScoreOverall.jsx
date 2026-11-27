import { tone } from "../lib/tone.js";

// The big headline number at the top of the scorecard.
export default function ScoreOverall({ overall, words, matchedCount }) {
  const t = tone(overall);
  return (
    <div className="border-t border-line pt-5">
      <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="text-sm text-faint">Overall match</p>
          <p className="mt-1 text-muted">
            {words} words analysed. {matchedCount} job terms found in your resume.
          </p>
        </div>
        <p className={`font-display text-8xl leading-none ${t.text}`}>
          {overall}
          <span className="text-2xl text-muted">/100</span>
        </p>
      </div>
    </div>
  );
}
