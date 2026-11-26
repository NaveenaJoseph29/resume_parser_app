// Resume Parser: extracts text from a resume, compares it to a job description,
// and renders a scorecard. Everything runs in the browser; nothing is uploaded.

const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "are", "will", "that", "this", "from",
  "have", "has", "our", "who", "they", "their", "what", "about", "into", "such", "can",
  "must", "should", "etc", "also", "able", "strong", "good", "great", "work", "team",
  "years", "year", "experience", "role", "job", "candidate", "ability", "skills", "skill",
  "including", "etc", "being", "more", "other", "than", "all", "any", "not", "but", "use",
  "using", "per", "via", "our", "we", "is", "in", "of", "to", "a", "an", "or", "on", "at",
  "by", "as", "be", "it", "if", "its", "new", "like", "plus", "build", "building",
]);

// Known technical skills. Used to find important terms in the job description
// and to check whether the resume shows them.
const SKILLS = [
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "ruby", "php",
  "swift", "kotlin", "html", "css", "tailwind", "bootstrap", "react", "next.js", "vue",
  "angular", "svelte", "node.js", "express", "django", "flask", "spring", "rails",
  "sql", "postgresql", "mysql", "mongodb", "redis", "graphql", "rest", "api", "docker",
  "kubernetes", "aws", "azure", "gcp", "terraform", "linux", "git", "ci/cd", "jenkins",
  "github actions", "testing", "jest", "cypress", "playwright", "selenium", "agile",
  "scrum", "machine learning", "deep learning", "pytorch", "tensorflow", "pandas", "numpy",
  "data analysis", "excel", "tableau", "power bi", "figma", "accessibility", "seo",
  "microservices", "system design", "security", "oauth", "websockets", "communication",
  "leadership", "problem solving", "mentoring", "product", "stakeholder",
];

const SECTION_HEADINGS = {
  summary: /\b(summary|profile|about me|objective)\b/i,
  experience: /\b(experience|work history|employment)\b/i,
  education: /\b(education|academic)\b/i,
  projects: /\b(projects?|portfolio)\b/i,
  skills: /\b(skills|technologies|tech stack|tools)\b/i,
};

// ---------- 1. Reading the uploaded file ----------

async function readPdf(arrayBuffer) {
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  let text = "";
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
}

async function readDocx(arrayBuffer) {
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// Returns plain text for a PDF, DOCX or TXT file.
async function extractText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return readPdf(await file.arrayBuffer());
  if (name.endsWith(".docx")) return readDocx(await file.arrayBuffer());
  if (name.endsWith(".txt")) return file.text();
  throw new Error("Unsupported file type. Use a PDF, DOCX or TXT file.");
}

// ---------- 2. Analysing the text ----------

// Escapes characters that have a special meaning in regular expressions.
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// True when the term appears as a whole word. Lookarounds let terms like "c++" or "node.js" work.
function hasTerm(text, term) {
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

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function analyse(resumeText, jdText) {
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
    keywordScore * 0.45 + skillScore * 0.25 + experienceScore * 0.15 +
    sectionScore * 0.10 + formatScore * 0.05
  );

  // Strengths and weaknesses written as plain sentences.
  const strengths = [];
  const weaknesses = [];

  if (skillsMatched.length) strengths.push(`Covers ${skillsMatched.length} of ${jdSkills.length} required skills from the job description.`);
  if (jdYears !== null && resumeYears !== null && resumeYears >= jdYears) strengths.push(`Experience (${resumeYears}+ years mentioned) meets the ${jdYears}+ years asked for.`);
  if (sections.length >= 4) strengths.push(`Well structured: has ${sections.join(", ")} sections.`);
  if (words >= 300 && words <= 900) strengths.push("Length is in a good range for a resume.");
  if ((resume.match(/\d+\s*%|\$\s?\d|\d+x\b|\d{2,}/g) || []).length >= 3) strengths.push("Uses numbers and results to show impact.");

  if (skillsMissing.length) weaknesses.push(`Missing ${skillsMissing.length} required skill${skillsMissing.length > 1 ? "s" : ""}: ${skillsMissing.slice(0, 6).join(", ")}.`);
  if (jdYears !== null && (resumeYears === null || resumeYears < jdYears)) weaknesses.push(`The job asks for ${jdYears}+ years; your resume shows ${resumeYears ?? "none"}.`);
  const missingSections = Object.keys(SECTION_HEADINGS).filter((s) => !sections.includes(s));
  if (missingSections.length) weaknesses.push(`No clear ${missingSections.join(", ")} section${missingSections.length > 1 ? "s" : ""} found.`);
  if ((resume.match(/\d+\s*%|\$\s?\d|\d+x\b|\d{2,}/g) || []).length < 3) weaknesses.push("Few numbers or measurable results. Add metrics such as percentages, counts or time saved.");
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

// ---------- 3. Drawing the scorecard ----------

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Colour for a score: green good, amber middling, red weak.
function tone(score) {
  if (score >= 75) return { text: "text-emerald-400", bar: "bg-emerald-500" };
  if (score >= 50) return { text: "text-amber-400", bar: "bg-amber-500" };
  return { text: "text-rose-400", bar: "bg-rose-500" };
}

function chips(items, classes) {
  if (!items.length) return `<p class="text-sm text-slate-500">None found.</p>`;
  return `<div class="flex flex-wrap gap-2">${items
    .map((i) => `<span class="rounded-full px-3 py-1 text-sm ${classes}">${escapeHtml(i)}</span>`)
    .join("")}</div>`;
}

function list(items, emptyText) {
  if (!items.length) return `<p class="text-sm text-slate-500">${emptyText}</p>`;
  return `<ul class="list-disc space-y-2 pl-5 text-sm text-slate-300">${items
    .map((i) => `<li>${escapeHtml(i)}</li>`)
    .join("")}</ul>`;
}

function card(title, body) {
  return `<h3 class="mb-4 text-lg font-semibold">${title}</h3>${body}`;
}

function render(result) {
  const t = tone(result.overall);

  document.getElementById("overall").innerHTML = `
    <div class="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
      <div>
        <p class="text-sm uppercase tracking-widest text-slate-500">Overall match</p>
        <p class="mt-1 text-slate-400">${result.words} words analysed. ${result.matched.length} job terms found in your resume.</p>
      </div>
      <p class="text-6xl font-extrabold ${t.text}">${result.overall}<span class="text-2xl text-slate-500">/100</span></p>
    </div>`;

  document.getElementById("breakdown").innerHTML = Object.entries(result.scores)
    .map(([label, score]) => {
      const s = tone(score);
      return `
        <div class="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p class="text-sm text-slate-400">${label}</p>
          <p class="mt-1 text-2xl font-bold ${s.text}">${score}</p>
          <div class="mt-3 h-2 rounded-full bg-slate-800">
            <div class="h-2 rounded-full ${s.bar}" style="width: ${score}%"></div>
          </div>
        </div>`;
    })
    .join("");

  document.getElementById("matched").innerHTML = card(
    "What matches",
    chips(result.matched, "bg-emerald-500/10 text-emerald-300")
  );
  document.getElementById("missing").innerHTML = card(
    "What is missing",
    chips(result.missing, "bg-rose-500/10 text-rose-300")
  );
  document.getElementById("strengths").innerHTML = card(
    "Strengths",
    list(result.strengths, "No clear strengths found yet.")
  );
  document.getElementById("weaknesses").innerHTML = card(
    "Weaknesses",
    list(result.weaknesses, "No major weaknesses found.") +
    (result.extraSkills.length
      ? `<p class="mt-4 text-sm text-slate-400">Extra skills on your resume not in this job: ${escapeHtml(result.extraSkills.join(", "))}.</p>`
      : "")
  );

  document.getElementById("scorecard").classList.remove("hidden");
  document.getElementById("scorecard").scrollIntoView({ behavior: "smooth" });
}

// ---------- 4. Wiring up the page ----------

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("resume-input");
const fileNameEl = document.getElementById("file-name");
const resumeError = document.getElementById("resume-error");
const jdInput = document.getElementById("jd-input");
const analyzeBtn = document.getElementById("analyze-btn");
const statusEl = document.getElementById("status");
const form = document.getElementById("match-form");

let resumeText = "";

function updateButton() {
  analyzeBtn.disabled = !(resumeText.trim() && jdInput.value.trim());
}

async function handleFile(file) {
  resumeError.classList.add("hidden");
  fileNameEl.classList.add("hidden");
  resumeText = "";
  updateButton();

  if (!file) return;
  statusEl.textContent = `Reading ${file.name}...`;
  statusEl.classList.remove("hidden");

  try {
    resumeText = await extractText(file);
    if (!resumeText.trim()) throw new Error("No readable text found. Scanned PDFs need OCR first.");
    fileNameEl.textContent = file.name;
    fileNameEl.classList.remove("hidden");
  } catch (err) {
    resumeError.textContent = err.message;
    resumeError.classList.remove("hidden");
  } finally {
    statusEl.classList.add("hidden");
    updateButton();
  }
}

// Drag and drop: stop the browser opening the file, then read it.
["dragenter", "dragover"].forEach((evt) =>
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.add("border-indigo-500", "bg-indigo-500/5");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropZone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropZone.classList.remove("border-indigo-500", "bg-indigo-500/5");
  })
);
dropZone.addEventListener("drop", (e) => handleFile(e.dataTransfer.files[0]));

fileInput.addEventListener("change", () => handleFile(fileInput.files[0]));
jdInput.addEventListener("input", updateButton);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  render(analyse(resumeText, jdInput.value));
});
