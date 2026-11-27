import { STOPWORDS, SKILLS, SECTION_HEADINGS, WEIGHTS } from "./constants.js";

// Pure functions: text in, numbers and sentences out. No React here, so they are easy to test.

// Escapes characters that have a special meaning in regular expressions.
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// True when the term appears as a whole word. Lookarounds let terms like "c++" or "node.js" work.
export function hasTerm(text, term) {
  const pattern = new RegExp(`(?<![a-z0-9])${escapeRegex(term)}(?![a-z0-9])`, "i");
  return pattern.test(text);
}

// Pulls out the skills the job description asks for.
function skillsIn(text) {
  const lower = text.toLowerCase();
  return SKILLS.filter((skill) => hasTerm(lower, skill));
}

// Picks the most repeated meaningful words in the job description.
function keywordsIn(jd, limit = 25) {
  const counts = new Map();
  const words = jd
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s/-]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[.\-/]+|[.\-/]+$/g, ""));

  for (const word of words) {
    if (word.length < 3 || STOPWORDS.has(word) || /^\d+$/.test(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

// Finds the largest "N years" figure in a piece of text, or null.
function yearsIn(text) {
  const matches = [...text.matchAll(/(\d+)\+?\s*(?:years|yrs)/gi)];
  if (matches.length === 0) return null;
  return Math.max(...matches.map((m) => Number(m[1])));
}

function countSections(resume) {
  const found = [];
  for (const [name, pattern] of Object.entries(SECTION_HEADINGS)) {
    if (pattern.test(resume)) found.push(name);
  }
  return found;
}

// Keeps a score between 0 and 100, rounded to a whole number.
export function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

// Counts figures that look like measurable results: percentages, $ amounts, "3x", two-digit numbers.
const METRIC_PATTERN = /\d+\s*%|\$\s?\d|\d+x\b|\d{2,}/g;

export function analyse(resumeText, jdText) {
  const resume = resumeText.replace(/\s+/g, " ").trim();
  const jd = jdText.trim();
  const resumeLower = resume.toLowerCase();

  // Keywords and skills the job asks for, and whether the resume has them.
  const jdSkills = skillsIn(jd);
  const jdKeywords = keywordsIn(jd);
  const allTerms = [...new Set([...jdSkills, ...jdKeywords])];

  const matched = allTerms.filter((t) => hasTerm(resumeLower, t));
  const missing = allTerms.filter((t) => !matched.includes(t));

  const skillsMatched = jdSkills.filter((s) => hasTerm(resumeLower, s));
  const skillsMissing = jdSkills.filter((s) => !skillsMatched.includes(s));
  const resumeSkills = skillsIn(resume);
  const extraSkills = resumeSkills.filter((s) => !jdSkills.includes(s));

  // Scores, each out of 100.
  const keywordScore = allTerms.length ? (matched.length / allTerms.length) * 100 : 0;
  const skillScore = jdSkills.length ? (skillsMatched.length / jdSkills.length) * 100 : keywordScore;

  const jdYears = yearsIn(jd);
  const resumeYears = yearsIn(resume);
  let experienceScore;
  if (jdYears === null) experienceScore = 100;
  else if (resumeYears === null) experienceScore = 40;
  else experienceScore = clamp((resumeYears / jdYears) * 100);

  const sections = countSections(resume);
  const sectionScore = (sections.length / Object.keys(SECTION_HEADINGS).length) * 100;

  const words = resume.split(" ").filter(Boolean).length;
  let formatScore;
  if (words >= 300 && words <= 900) formatScore = 100;
  else if (words < 300) formatScore = (words / 300) * 100;
  else formatScore = Math.max(60, 100 - (words - 900) / 10);

  const overall = clamp(
    keywordScore * WEIGHTS.keywords +
    skillScore * WEIGHTS.skills +
    experienceScore * WEIGHTS.experience +
    sectionScore * WEIGHTS.sections +
    formatScore * WEIGHTS.format
  );

  const metricCount = (resume.match(METRIC_PATTERN) || []).length;

  // Strengths and weaknesses written as plain sentences.
  const strengths = [];
  const weaknesses = [];

  if (skillsMatched.length) strengths.push(`Covers ${skillsMatched.length} of ${jdSkills.length} required skills from the job description.`);
  if (jdYears !== null && resumeYears !== null && resumeYears >= jdYears) strengths.push(`Experience (${resumeYears}+ years mentioned) meets the ${jdYears}+ years asked for.`);
  if (sections.length >= 4) strengths.push(`Well structured: has ${sections.join(", ")} sections.`);
  if (words >= 300 && words <= 900) strengths.push("Length is in a good range for a resume.");
  if (metricCount >= 3) strengths.push("Uses numbers and results to show impact.");

  if (skillsMissing.length) weaknesses.push(`Missing ${skillsMissing.length} required skill${skillsMissing.length > 1 ? "s" : ""}: ${skillsMissing.slice(0, 6).join(", ")}.`);
  if (jdYears !== null && (resumeYears === null || resumeYears < jdYears)) weaknesses.push(`The job asks for ${jdYears}+ years; your resume shows ${resumeYears ?? "none"}.`);
  const missingSections = Object.keys(SECTION_HEADINGS).filter((s) => !sections.includes(s));
  if (missingSections.length) weaknesses.push(`No clear ${missingSections.join(", ")} section${missingSections.length > 1 ? "s" : ""} found.`);
  if (metricCount < 3) weaknesses.push("Few numbers or measurable results. Add metrics such as percentages, counts or time saved.");
  if (words < 300) weaknesses.push("Resume is short. Add more detail about projects and responsibilities.");
  if (words > 900) weaknesses.push("Resume is long. Trim older or less relevant items.");

  return {
    overall,
    scores: {
      Keywords: clamp(keywordScore),
      Skills: clamp(skillScore),
      Experience: clamp(experienceScore),
      Sections: clamp(sectionScore),
      Format: clamp(formatScore),
    },
    matched,
    missing,
    extraSkills,
    strengths,
    weaknesses,
    words,
  };
}
