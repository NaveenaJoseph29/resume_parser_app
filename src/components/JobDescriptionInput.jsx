// A controlled textarea: the parent owns the text and passes it in as `value`.
export default function JobDescriptionInput({ value, onChange }) {
  return (
    <section className="flex flex-col border-t border-line pt-5">
      <h2 className="font-display text-3xl">2. Job description</h2>
      <textarea
        id="jd-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here..."
        className="mt-4 min-h-[220px] flex-1 resize-y border border-line-strong bg-page/60 p-4 text-sm text-ink placeholder-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </section>
  );
}
