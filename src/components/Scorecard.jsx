import { useEffect, useRef } from "react";
import SectionCard from "./SectionCard.jsx";
import Chips from "./Chips.jsx";
import BulletList from "./BulletList.jsx";
import ScoreOverall from "./ScoreOverall.jsx";
import ScoreBreakdown from "./ScoreBreakdown.jsx";

// The whole results area. It only exists once there is a result to show.
export default function Scorecard({ result }) {
  const ref = useRef(null);

  // Scroll the results into view each time a new analysis arrives.
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [result]);

  return (
    <section ref={ref} className="mt-12">
      <ScoreOverall
        overall={result.overall}
        words={result.words}
        matchedCount={result.matched.length}
      />
      <ScoreBreakdown scores={result.scores} />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard title="What matches">
          <Chips items={result.matched} className="hl text-ink" emptyText="None found." />
        </SectionCard>

        <SectionCard title="What is missing">
          <Chips items={result.missing} className="miss text-ink" emptyText="None found." />
        </SectionCard>

        <SectionCard title="Strengths">
          <BulletList items={result.strengths} emptyText="No clear strengths found yet." />
        </SectionCard>

        <SectionCard title="Weaknesses">
          <BulletList items={result.weaknesses} emptyText="No major weaknesses found." />
          {result.extraSkills.length > 0 && (
            <p className="mt-4 text-sm text-muted">
              Extra skills on your resume not in this job: {result.extraSkills.join(", ")}.
            </p>
          )}
        </SectionCard>
      </div>
    </section>
  );
}
