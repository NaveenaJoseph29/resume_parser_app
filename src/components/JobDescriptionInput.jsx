// A controlled textarea: the parent owns the text and passes it in as `value`.
export default function JobDescriptionInput({ value, onChange }) {
  return (
    <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-lg font-semibold">2. Job description</h2>
      <textarea
        id="jd-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here..."
        className="mt-4 min-h-[220px] flex-1 resize-y rounded-xl border border-slate-700 bg-slate-950/60 p-4 text-sm text-slate-100 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
      />
    </section>
  );
}
