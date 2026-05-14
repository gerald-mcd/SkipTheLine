import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { venues, type Venue } from "@/lib/mock-data";
import { VenueDetailBody } from "@/components/VenueDetailBody";

type Ctx = { open: (id: string) => void; close: () => void };
const VenueSheetContext = createContext<Ctx | null>(null);

export function useVenueSheet() {
  const ctx = useContext(VenueSheetContext);
  if (!ctx) throw new Error("useVenueSheet must be used within VenueSheetProvider");
  return ctx;
}

export function VenueSheetProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const open = useCallback((next: string) => setId(next), []);
  const close = useCallback(() => setId(null), []);
  const venue = id ? venues.find((v) => v.id === id) ?? null : null;

  useEffect(() => {
    if (!venue) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [venue, close]);

  return (
    <VenueSheetContext.Provider value={{ open, close }}>
      {children}
      {venue && <VenueSheet venue={venue} onClose={close} />}
    </VenueSheetContext.Provider>
  );
}

function VenueSheet({ venue: v, onClose }: { venue: Venue; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true">
      <button aria-label="Close" onClick={onClose} className="animate-fade-in absolute inset-0 bg-black/40" />
      <div
        className="animate-slide-up relative flex h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-card"
        style={{ boxShadow: "var(--shadow-lg)" }}
      >
        <div className="absolute left-1/2 top-2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-white/70" />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <VenueDetailBody
            venue={v}
            heroHeightClass="h-64"
            headerOverlay={
              <div className="absolute inset-x-0 top-0 flex items-center justify-end p-4">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 backdrop-blur"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}