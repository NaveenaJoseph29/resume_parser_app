import { useState } from "react";

// Drag-and-drop state for a drop zone. Returns the handlers to spread onto the element.
export function useDropZone(onFile) {
  const [isDragging, setIsDragging] = useState(false);

  const handlers = {
    // preventDefault stops the browser opening the file. Without it, the drop never fires.
    onDragEnter: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragOver: (e) => {
      e.preventDefault();
    },
    onDragLeave: (e) => {
      e.preventDefault();
      setIsDragging(false);
    },
    onDrop: (e) => {
      e.preventDefault();
      setIsDragging(false);
      onFile(e.dataTransfer.files[0]);
    },
  };

  return { isDragging, handlers };
}
