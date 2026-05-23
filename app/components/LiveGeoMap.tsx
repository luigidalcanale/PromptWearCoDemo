"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Globe } from "lucide-react";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Ping = {
  id: number;
  city: string;
  country: string;
  coords: [number, number]; // [lng, lat]
  kind: "session" | "order";
  ts: number;
};

// Coords (lng, lat) for cities referenced in lib/users.ts + ticker pool
const CITY_COORDS: Record<string, [number, number]> = {
  Berlin: [13.405, 52.52],
  Toronto: [-79.38, 43.65],
  Mumbai: [72.87, 19.07],
  Hamburg: [9.99, 53.55],
  Milan: [9.19, 45.46],
  Osaka: [135.5, 34.69],
  Phoenix: [-112.07, 33.45],
  Brooklyn: [-73.94, 40.65],
  Madrid: [-3.7, 40.42],
  Austin: [-97.74, 30.27],
  Tokyo: [139.69, 35.69],
  Lagos: [3.38, 6.52],
  Beirut: [35.51, 33.89],
  Lyon: [4.83, 45.76],
  "Mexico City": [-99.13, 19.43],
  Paris: [2.35, 48.85],
  Dublin: [-6.26, 53.35],
  Seoul: [126.98, 37.57],
  Oslo: [10.75, 59.91],
  Edinburgh: [-3.19, 55.95],
  Vancouver: [-123.12, 49.28],
  Prague: [14.42, 50.08],
  Munich: [11.58, 48.14],
  Bangalore: [77.59, 12.97],
  Cairo: [31.24, 30.04],
  Sydney: [151.21, -33.87],
  Lisbon: [-9.14, 38.72],
  Pune: [73.86, 18.52],
  Auckland: [174.76, -36.85],
  "São Paulo": [-46.63, -23.55],
};

const CITY_LIST = Object.keys(CITY_COORDS);

let counter = 1;

function makePing(): Ping {
  const city = CITY_LIST[Math.floor(Math.random() * CITY_LIST.length)];
  const coords = CITY_COORDS[city];
  return {
    id: counter++,
    city,
    country: "",
    coords,
    kind: Math.random() < 0.35 ? "order" : "session",
    ts: Date.now(),
  };
}

export function LiveGeoMap() {
  const [pings, setPings] = useState<Ping[]>([]);

  useEffect(() => {
    // Seed with a few cities visible at mount
    const initial: Ping[] = [];
    for (let i = 0; i < 4; i++) initial.push(makePing());
    setPings(initial);

    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setPings((prev) => {
          const next = [...prev, makePing()];
          // Trim pings older than 6s so the map breathes
          const cutoff = Date.now() - 6000;
          return next.filter((p) => p.ts > cutoff);
        });
        schedule();
      }, 800 + Math.random() * 1800);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  // Periodically purge stale pings even if no new ones arrived recently
  useEffect(() => {
    const id = setInterval(() => {
      const cutoff = Date.now() - 6000;
      setPings((prev) => prev.filter((p) => p.ts > cutoff));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Globe size={14} className="text-blue-500" />
          Live Sessions — Worldwide
        </h2>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 ping-dot" />
          {pings.length} active
        </span>
      </div>
      <div className="relative">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 145 }}
          width={800}
          height={360}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="var(--muted)"
                  stroke="var(--border)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "var(--accent)", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>
          {pings.map((p) => {
            const color = p.kind === "order" ? "#22c55e" : "#3b82f6";
            return (
              <Marker key={p.id} coordinates={p.coords}>
                <g>
                  <circle r={3} fill={color} opacity={0.95} />
                  <circle r={3} fill={color}>
                    <animate attributeName="r" from="3" to="18" dur="2s" begin="0s" repeatCount="1" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0s" repeatCount="1" />
                  </circle>
                </g>
              </Marker>
            );
          })}
        </ComposableMap>
        <div className="absolute bottom-2 left-3 flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Session
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Order
          </span>
        </div>
      </div>
    </div>
  );
}
