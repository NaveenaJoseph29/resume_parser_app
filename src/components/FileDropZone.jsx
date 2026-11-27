import { useDropZone } from "../hooks/useDropZone.js";

// The resume picker: drag a file onto it, or click to choose one.
export default function FileDropZone({ fileName, error, onFile }) {
  const { isDragging, handlers } = useDropZone(onFile);

  return (
    <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-lg font-semibold">1. Your resume</h2>

      <label
        htmlFor="resume-input"
        {...handlers}
        className={`mt-4 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-slate-950/60 p-6 text-center transition hover:border-indigo-500 ${
          isDragging ? "border-indigo-500 bg-indigo-500/5" : "border-slate-700"
        }`}
      >
        <svg className="h-12 w-12 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        <p className="mt-4 font-medium">Drag and drop your resume here</p>
        <p className="mt-1 text-sm text-slate-500">or click to choose a file (.pdf, .docx, .txt)</p>
        {fileName && (
          <p className="mt-4 rounded-full bg-indigo-500/10 px-4 py-1 text-sm text-indigo-300">{fileName}</p>
        )}
      </label>

      <input
        id="resume-input"
        type="file"
        accept=".pdf,.docx,.txt"
        className="sr-only"
        onChange={(e) => onFile(e.target.files[0])}
      />
      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
    </section>
  );
}
