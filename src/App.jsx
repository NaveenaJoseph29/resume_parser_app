import { useState } from "react";
import { useResumeFile } from "./hooks/useResumeFile.js";
import { useAnalysis } from "./hooks/useAnalysis.js";
import FileDropZone from "./components/FileDropZone.jsx";
import JobDescriptionInput from "./components/JobDescriptionInput.jsx";
import Scorecard from "./components/Scorecard.jsx";

// The page: the header, the two inputs, the button, and the scorecard once there is one.
export default function App() {
  const resume = useResumeFile();
  const { result, run } = useAnalysis();
  const [jobDescription, setJobDescription] = useState("");

  const canAnalyze = Boolean(resume.text.trim() && jobDescription.trim());

  function handleSubmit(e) {
    e.preventDefault();
    run(resume.text, jobDescription);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Resume Parser</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">See how your resume matches a job</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          Drop your resume (PDF, DOCX or TXT), paste the job description, and get a scorecard
          showing what matches, what is missing, and where you are strong or weak.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <FileDropZone fileName={resume.fileName} error={resume.error} onFile={resume.loadFile} />
        <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />

        <div className="flex justify-center lg:col-span-2">
          <button
            type="submit"
            disabled={!canAnalyze}
            className="rounded-xl bg-indigo-500 px-8 py-3 font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Analyze match
          </button>
        </div>
      </form>

      {resume.isReading && (
        <p className="mt-4 text-center text-sm text-slate-400">Reading your resume...</p>
      )}

      {result && <Scorecard result={result} />}
    </main>
  );
}
