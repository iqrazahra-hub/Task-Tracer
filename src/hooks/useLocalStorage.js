import { useEffect, useState } from "react";

// Custom hook: works like useState, but the value survives page reloads.
export default function useLocalStorage(key, initialValue) {
  // Lazy initializer: runs only on the first render.
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Side effect: write to storage whenever key or value changes.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable: ignore */
    }
  }, [key, value]);

  return [value, setValue];
}