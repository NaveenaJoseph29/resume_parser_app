// A rounded panel with a title. Used for every block of the scorecard.
export default function SectionCard({ title, children }) {
  return (
    <div className="border-t border-line pt-5">
      <h3 className="mb-4 font-display text-3xl text-ink">{title}</h3>
      {children}
    </div>
  );
}
