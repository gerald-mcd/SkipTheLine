import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { Venue } from "@/lib/mock-data";
import { useVenueSheet } from "@/components/VenueSheet";

// Map venue x/y (0-100 %) to real lat/lng around Miami so the OSM tiles
// have meaningful geography under each pin.
const CENTER: [number, number] = [25.774, -80.19];
const LAT_SPREAD = 0.06;
const LNG_SPREAD = 0.07;
function venueLatLng(v: Venue): [number, number] {
  const lat = CENTER[0] + (50 - v.y) / 100 * LAT_SPREAD;
  const lng = CENTER[1] + (v.x - 50) / 100 * LNG_SPREAD;
  return [lat, lng];
}

/**
 * Real interactive map powered by Leaflet + OpenStreetMap tiles. No API key
 * required. Themed pins use the app's primary color and open the shared
 * VenueSheet on click.
 */
export function LeafletMap({
  venues,
  focusedId,
  onPinClick,
}: {
  venues: Venue[];
  focusedId?: string | null;
  onPinClick?: (id: string) => void;
}) {
  const { open: openVenueSheet } = useVenueSheet();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const LRef = useRef<any>(null);

  // Init map once on mount (client-only).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;
      LRef.current = L;
      const map = L.map(containerRef.current, {
        center: CENTER,
        zoom: 13,
        zoomControl: false,
        attributionControl: true,
      });
      // Carto light/dark tiles (no API key) — pick by current theme.
      const isDark = document.documentElement.classList.contains("dark");
      const tileUrl = isDark
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
      L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20,
      }).addTo(map);
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = {};
    };
  }, []);

  // Sync markers with venues prop.
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    const nextIds = new Set(venues.map((v) => v.id));
    // Remove stale markers
    for (const id of Object.keys(markersRef.current)) {
      if (!nextIds.has(id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    }
    // Add new markers
    for (const v of venues) {
      if (markersRef.current[v.id]) continue;
      const isFocused = v.id === focusedId;
      const html = pinHtml(isFocused);
      const icon = L.divIcon({
        className: "stl-pin",
        html,
        iconSize: [28, 36],
        iconAnchor: [14, 36],
      });
      const marker = L.marker(venueLatLng(v), { icon }).addTo(map);
      marker.on("click", () => {
        if (onPinClick) onPinClick(v.id);
        else openVenueSheet(v.id);
      });
      markersRef.current[v.id] = marker;
    }
  }, [venues, onPinClick, openVenueSheet, focusedId]);

  // Refresh icons on focus change + pan to focused.
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    for (const v of venues) {
      const m = markersRef.current[v.id];
      if (!m) continue;
      const isFocused = v.id === focusedId;
      m.setIcon(
        L.divIcon({
          className: "stl-pin",
          html: pinHtml(isFocused),
          iconSize: [28, 36],
          iconAnchor: [14, 36],
        }),
      );
    }
    if (focusedId) {
      const v = venues.find((x) => x.id === focusedId);
      if (v) map.flyTo(venueLatLng(v), 15, { duration: 0.6 });
    }
  }, [focusedId, venues]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{ background: "var(--background)" }}
      data-map-root
    />
  );
}

function pinHtml(isFocused: boolean) {
  const fill = isFocused ? "var(--primary)" : "var(--foreground)";
  const shadow = isFocused
    ? "drop-shadow(0 6px 14px color-mix(in oklab, var(--primary) 55%, transparent))"
    : "drop-shadow(0 4px 6px rgba(0,0,0,0.25))";
  const scale = isFocused ? 1.25 : 1;
  return `<div style="transform: scale(${scale}); transform-origin: 50% 100%; filter: ${shadow};">
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.5 12.2 20.8 13.2 21.7a1.2 1.2 0 0 0 1.6 0C15.8 34.8 28 23.5 28 14 28 6.27 21.73 0 14 0Z" fill="${fill}"/>
      <circle cx="14" cy="14" r="4.5" fill="white"/>
    </svg>
  </div>`;
}