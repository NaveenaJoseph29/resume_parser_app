// A fixed sample result, shaped exactly like analyse() returns it.
// The landing page shows it as a preview of the results screen. It is not computed from anyone's resume.
export const demoResult = {
  overall: 78,
  scores: {
    Keywords: 82,
    Skills: 75,
    Experience: 67,
    Sections: 100,
    Format: 100,
  },
  matched: ["javascript", "react", "node.js", "testing", "api", "agile", "git"],
  missing: ["typescript", "graphql", "docker", "aws"],
  extraSkills: ["python", "sql"],
  strengths: [
    "Covers 4 of 6 required skills from the job description.",
    "Well structured: has experience, education, skills, projects sections.",
    "Length is in a good range for a resume.",
    "Uses numbers and results to show impact.",
  ],
  weaknesses: [
    "Missing 2 required skills: typescript, docker.",
    "The job asks for 5+ years; your resume shows 3.",
  ],
  words: 540,
};
