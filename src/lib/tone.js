// Colour for a score: green good, amber middling, red weak.
export function tone(score) {
  if (score >= 75) return { text: "text-emerald-400", bar: "bg-emerald-500" };
  if (score >= 50) return { text: "text-amber-400", bar: "bg-amber-500" };
  return { text: "text-rose-400", bar: "bg-rose-500" };
}
