// Colour for a score: good, warn (middling) or bad (weak). These are theme tokens, so they stay readable in both themes.
export function tone(score) {
  if (score >= 75) return { text: "text-good", bar: "bg-good" };
  if (score >= 50) return { text: "text-warn", bar: "bg-warn" };
  return { text: "text-bad", bar: "bg-bad" };
}
