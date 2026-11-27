import { useState, useCallback } from "react";
import { extractText } from "../lib/extractText.js";

// Owns everything about the uploaded resume: its text, its name, any error, and whether it is loading.
export function useResumeFile() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isReading, setIsReading] = useState(false);

  // useCallback keeps the same function between renders, so children that receive it do not re-render needlessly.
  const loadFile = useCallback(async (file) => {
    setText("");
    setFileName("");
    setError("");
    if (!file) return;

    setIsReading(true);
    try {
      const content = await extractText(file);
      if (!content.trim()) {
        throw new Error("No readable text found. Scanned PDFs need OCR first.");
      }
      setText(content);
      setFileName(file.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsReading(false);
    }
  }, []);

  return { text, fileName, error, isReading, loadFile };
}
