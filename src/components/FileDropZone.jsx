import { useDropZone } from "../hooks/useDropZone.js";

// The resume picker: drag a file onto it, or click to choose one.
export default function FileDropZone({ fileName, error, onFile }) {
  const { isDragging, handlers } = useDropZone(onFile);

  return (
    <section className="flex flex-col border-t border-line pt-5">
      <h2 className="font-display text-3xl">1. Your resume</h2>

      <label
        htmlFor="resume-input"
        {...handlers}
        className={`mt-4 flex min-h-[220px] cursor-pointer flex-col items-center justify-center border-2 border-dashed bg-page/60 p-6 text-center transition hover:border-accent ${
          isDragging ? "border-accent bg-accent/5" : "border-line-strong"
        }`}
      >
        <svg className="h-12 w-12 text-faint" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>
        <p className="mt-4 font-medium">Drag and drop your resume here</p>
        <p className="mt-1 text-sm text-muted">or click to choose a file (.pdf, .docx, .txt)</p>
        {fileName && (
          <p className="mt-4 bg-accent/10 px-3 py-1 text-sm text-accent">{fileName}</p>
        )}
      </label>

      <input
        id="resume-input"
        type="file"
        accept=".pdf,.docx,.txt"
        className="sr-only"
        onChange={(e) => onFile(e.target.files[0])}
      />
      {error && <p className="mt-3 text-sm text-bad">{error}</p>}
    </section>
  );
}
