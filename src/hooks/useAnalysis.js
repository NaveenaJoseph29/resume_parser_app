import { useState, useCallback } from "react";

// Sends the resume text and job description to our Express server, which calls labd.
// The browser never sees the labd key. This hook owns the result, loading and error state.
export function useAnalysis() {
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const run = useCallback(async (resumeText, jobDescription) => {
    setIsAnalyzing(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `The server returned an error (${res.status}).`);
      }
      setResult(data.report);
    } catch (err) {
      setError(err.message || "Could not reach the server.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return { result, isAnalyzing, error, run };
}
