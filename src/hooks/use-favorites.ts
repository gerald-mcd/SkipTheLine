import { useEffect, useState, useCallback } from "react";

const KEY = "stl:favorites";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setIds(read());
    };
    const onCustom = () => setIds(read());
    window.addEventListener("storage", onStorage);
    window.addEventListener("stl:favorites-change", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("stl:favorites-change", onCustom);
    };
  }, []);

  const toggle = useCallback((id: string) => {
    const current = read();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("stl:favorites-change"));
  }, []);

  const isFav = useCallback((id: string) => ids.includes(id), [ids]);

  return { ids, isFav, toggle };
}