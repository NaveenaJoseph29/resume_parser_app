// A rounded panel with a title. Used for every block of the scorecard.
export default function SectionCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="mb-4 text-lg font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}
