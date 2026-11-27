// Words ignored when picking keywords out of a job description.
export const STOPWORDS = new Set([
  "the", "and", "for", "with", "you", "your", "are", "will", "that", "this", "from",
  "have", "has", "our", "who", "they", "their", "what", "about", "into", "such", "can",
  "must", "should", "etc", "also", "able", "strong", "good", "great", "work", "team",
  "years", "year", "experience", "role", "job", "candidate", "ability", "skills", "skill",
  "including", "being", "more", "other", "than", "all", "any", "not", "but", "use",
  "using", "per", "via", "we", "is", "in", "of", "to", "a", "an", "or", "on", "at",
  "by", "as", "be", "it", "if", "its", "new", "like", "plus", "build", "building",
]);

// Known technical skills. Used to find important terms in the job description
// and to check whether the resume shows them.
export const SKILLS = [
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

// Resume sections we look for, and the headings that signal each one.
export const SECTION_HEADINGS = {
  summary: /\b(summary|profile|about me|objective)\b/i,
  experience: /\b(experience|work history|employment)\b/i,
  education: /\b(education|academic)\b/i,
  projects: /\b(projects?|portfolio)\b/i,
  skills: /\b(skills|technologies|tech stack|tools)\b/i,
};

// Weights for the overall score. They add up to 1.
export const WEIGHTS = {
  keywords: 0.45,
  skills: 0.25,
  experience: 0.15,
  sections: 0.1,
  format: 0.05,
};
