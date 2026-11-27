import { useState, useCallback } from "react";
import { analyse } from "../lib/analyse.js";

// Holds the latest scorecard. run() is called on submit with the resume text and job description.
export function useAnalysis() {
  const [result, setResult] = useState(null);

  const run = useCallback((resumeText, jobDescription) => {
    setResult(analyse(resumeText, jobDescription));
  }, []);

  return { result, run };
}
