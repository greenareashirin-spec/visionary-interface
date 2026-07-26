// Live time & weather-aware scene for the Command Center.
// Uses browser geolocation + Open-Meteo (no API key) with a Baghdad fallback.

import { useEffect, useState } from "react";

export type Period = "dawn" | "morning" | "day" | "golden" | "dusk" | "night";
export type Weather =
  | "clear"
  | "cloudy"
  | "fog"
  | "rain"
  | "thunder"
  | "snow"
  | "sandstorm";

export type LiveWeather = {
  weather: Weather;
  tempC: number | null;
  wind: number | null;
  place: string;
  loading: boolean;
};

export function currentPeriod(now = new Date()): Period {
  const h = now.getHours();
  if (h < 5) return "night";
  if (h < 7) return "dawn";
  if (h < 11) return "morning";
  if (h < 16) return "day";
  if (h < 18) return "golden";
  if (h < 20) return "dusk";
  return "night";
}

export function periodLabel(p: Period): string {
  return { dawn: "Dawn", morning: "Morning light", day: "Bright day", golden: "Golden hour", dusk: "Dusk", night: "Night" }[p];
}

export function greeting(p: Period): string {
  return { dawn: "Early light", morning: "Good morning", day: "Good afternoon", golden: "Golden hour", dusk: "Evening settles", night: "Quiet night" }[p];
}

/* WMO code → weather bucket. */
function codeToWeather(code: number, wind: number, lat: number, lon: number): Weather {
  if ([95, 96, 99].includes(code)) return "thunder";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([45, 48].includes(code)) return "fog";
  const cloudy = [1, 2, 3].includes(code);
  // Middle-East sandstorm heuristic: dry region + strong wind + clear/haze code.
  const inME = lat >= 20 && lat <= 40 && lon >= 30 && lon <= 60;
  if (inME && wind >= 35 && (code === 0 || cloudy || code === 45 || code === 48)) return "sandstorm";
  if (cloudy) return "cloudy";
  return "clear";
}

const FALLBACK = { lat: 33.3152, lon: 44.3661, place: "Baghdad" };

export function useLiveWeather(): LiveWeather {
  const [state, setState] = useState<LiveWeather>({
    weather: "clear", tempC: null, wind: null, place: FALLBACK.place, loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load(lat: number, lon: number, place: string) {
      try {
        const r = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`,
        );
        const j = await r.json();
        const c = j?.current;
        if (!c || cancelled) return;
        const weather = codeToWeather(c.weather_code ?? 0, c.wind_speed_10m ?? 0, lat, lon);
        setState({ weather, tempC: c.temperature_2m ?? null, wind: c.wind_speed_10m ?? null, place, loading: false });
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    }

    async function reverse(lat: number, lon: number): Promise<string> {
      try {
        const r = await fetch(
          `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`,
        );
        const j = await r.json();
        return j?.results?.[0]?.name ?? FALLBACK.place;
      } catch {
        return FALLBACK.place;
      }
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          const place = await reverse(latitude, longitude);
          if (!cancelled) load(latitude, longitude, place);
        },
        () => load(FALLBACK.lat, FALLBACK.lon, FALLBACK.place),
        { timeout: 6000, maximumAge: 15 * 60 * 1000 },
      );
    } else {
      load(FALLBACK.lat, FALLBACK.lon, FALLBACK.place);
    }

    return () => { cancelled = true; };
  }, []);

  return state;
}

/** Overlay gradient + tint applied on top of the landscape photo. */
export function periodOverlay(p: Period): { gradient: string; tint: string; filter: string } {
  switch (p) {
    case "dawn":
      return { gradient: "linear-gradient(180deg, rgba(255,190,140,0.22) 0%, rgba(255,220,180,0.05) 45%, rgba(20,30,45,0.15) 100%)", tint: "rgba(255,180,130,0.08)", filter: "saturate(1.05) brightness(1.02)" };
    case "morning":
      return { gradient: "linear-gradient(180deg, rgba(255,240,210,0.15) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.05) 100%)", tint: "rgba(255,235,200,0.05)", filter: "saturate(1.05) brightness(1.05)" };
    case "day":
      return { gradient: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.02) 100%)", tint: "transparent", filter: "saturate(1.02) brightness(1.03)" };
    case "golden":
      return { gradient: "linear-gradient(180deg, rgba(255,180,110,0.22) 0%, rgba(255,200,140,0.08) 50%, rgba(120,60,30,0.12) 100%)", tint: "rgba(255,170,90,0.08)", filter: "saturate(1.1) brightness(1.02) contrast(1.02)" };
    case "dusk":
      return { gradient: "linear-gradient(180deg, rgba(180,140,180,0.25) 0%, rgba(90,80,120,0.15) 50%, rgba(20,25,45,0.35) 100%)", tint: "rgba(140,120,180,0.1)", filter: "saturate(0.95) brightness(0.85)" };
    case "night":
      return { gradient: "linear-gradient(180deg, rgba(10,20,40,0.55) 0%, rgba(15,25,50,0.5) 50%, rgba(0,10,25,0.6) 100%)", tint: "rgba(30,50,90,0.18)", filter: "saturate(0.85) brightness(0.55) contrast(1.05)" };
  }
}
