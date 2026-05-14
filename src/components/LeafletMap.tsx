import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Plus, Minus, LocateFixed, Loader2 } from "lucide-react";
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
  const clusterRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const [locating, setLocating] = useState(false);

  // Init map once on mount (client-only).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
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
      // Cluster group with themed cluster icons.
      const cluster = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        maxClusterRadius: 50,
        iconCreateFunction: (c: any) => {
          const count = c.getChildCount();
          const size = count < 10 ? 36 : count < 50 ? 44 : 52;
          return L.divIcon({
            className: "stl-cluster",
            html: clusterHtml(count, size),
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2],
          });
        },
      });
      map.addLayer(cluster);
      clusterRef.current = cluster;
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = {};
      clusterRef.current = null;
      userMarkerRef.current = null;
    };
  }, []);

  // Sync markers with venues prop.
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const cluster = clusterRef.current;
    if (!L || !map || !cluster) return;
    const nextIds = new Set(venues.map((v) => v.id));
    // Remove stale markers
    for (const id of Object.keys(markersRef.current)) {
      if (!nextIds.has(id)) {
        cluster.removeLayer(markersRef.current[id]);
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
      const marker = L.marker(venueLatLng(v), { icon });
      marker.on("click", () => {
        if (onPinClick) onPinClick(v.id);
        else openVenueSheet(v.id);
      });
      cluster.addLayer(marker);
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
      if (v) {
        map.flyTo(venueLatLng(v), 15, { duration: 0.6 });
        // Make sure the focused marker isn't hidden inside a cluster.
        const cluster = clusterRef.current;
        const m = markersRef.current[focusedId];
        if (cluster && m) cluster.zoomToShowLayer(m, () => {});
      }
    }
  }, [focusedId, venues]);

  const zoomBy = (delta: number) => {
    const map = mapRef.current;
    if (!map) return;
    map.setZoom(map.getZoom() + delta);
  };
  const locateMe = () => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ll: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
        const icon = L.divIcon({
          className: "stl-user",
          html: userDotHtml(),
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        userMarkerRef.current = L.marker(ll, { icon }).addTo(map);
        map.flyTo(ll, 15, { duration: 0.6 });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div className="absolute inset-0 z-0" data-map-root>
      <div
        ref={containerRef}
        className="absolute inset-0"
        style={{ background: "var(--background)" }}
      />
      {/* Map controls */}
      <div className="pointer-events-none absolute right-4 top-20 z-[400] flex flex-col gap-2">
        <div
          className="pointer-events-auto flex flex-col overflow-hidden rounded-2xl bg-card"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
        >
          <button
            type="button"
            onClick={() => zoomBy(1)}
            aria-label="Zoom in"
            className="inline-flex h-10 w-10 items-center justify-center transition-colors hover:bg-[var(--muted)] active:scale-95"
          >
            <Plus className="h-4 w-4" style={{ color: "var(--primary)" }} />
          </button>
          <span className="h-px" style={{ background: "var(--border)" }} />
          <button
            type="button"
            onClick={() => zoomBy(-1)}
            aria-label="Zoom out"
            className="inline-flex h-10 w-10 items-center justify-center transition-colors hover:bg-[var(--muted)] active:scale-95"
          >
            <Minus className="h-4 w-4" style={{ color: "var(--primary)" }} />
          </button>
        </div>
        <button
          type="button"
          onClick={locateMe}
          aria-label="Locate me"
          className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-card transition-transform active:scale-95"
          style={{ border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}
        >
          {locating ? (
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: "var(--primary)" }} />
          ) : (
            <LocateFixed className="h-4 w-4" style={{ color: "var(--primary)" }} />
          )}
        </button>
      </div>
    </div>
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

function clusterHtml(count: number, size: number) {
  return `<div style="
    width:${size}px;height:${size}px;border-radius:9999px;
    display:flex;align-items:center;justify-content:center;
    background:var(--primary);color:white;
    font-weight:800;font-size:${size >= 52 ? 14 : 13}px;
    box-shadow:0 0 0 4px color-mix(in oklab, var(--primary) 25%, transparent),
               0 6px 14px color-mix(in oklab, var(--primary) 45%, transparent);
    border:2px solid white;
  ">${count}</div>`;
}

function userDotHtml() {
  return `<div style="position:relative;width:22px;height:22px;">
    <span style="position:absolute;inset:-6px;border-radius:9999px;background:var(--primary);opacity:0.25;animation:stl-ping 1.4s ease-out infinite;"></span>
    <span style="position:absolute;inset:0;border-radius:9999px;background:var(--primary);box-shadow:0 0 0 3px white, 0 2px 8px rgba(0,0,0,0.25);"></span>
    <style>@keyframes stl-ping { 0%{transform:scale(0.6);opacity:0.5;} 100%{transform:scale(1.6);opacity:0;} }</style>
  </div>`;
}