// A rounded panel with a title. Used for every block of the scorecard.
export default function SectionCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}
