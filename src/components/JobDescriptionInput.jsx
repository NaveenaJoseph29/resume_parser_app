// A controlled textarea: the parent owns the text and passes it in as `value`.
export default function JobDescriptionInput({ value, onChange }) {
  return (
    <section className="flex flex-col rounded-2xl border border-line bg-surface p-6">
      <h2 className="text-lg font-semibold">2. Job description</h2>
      <textarea
        id="jd-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here..."
        className="mt-4 min-h-[220px] flex-1 resize-y rounded-xl border border-line-strong bg-page/60 p-4 text-sm text-ink placeholder-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </section>
  );
}
