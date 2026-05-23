"use client";

import { useEffect, useState } from "react";

/**
 * Streams `text` one character at a time. Returns the partial string and
 * a boolean for whether the animation is finished. Resets when text or
 * `runKey` changes.
 */
export function useTypewriter(text: string, speedMs = 14, runKey: unknown = null) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setOut("");
    setDone(false);
    if (!text) {
      setDone(true);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speedMs);
    return () => clearInterval(id);
  }, [text, speedMs, runKey]);

  return { text: out, done };
}
