// Time & (mock) weather-aware scene for the Command Center.
// Derives period from the local clock; weather is a deterministic mock so the
// experience feels alive today and can plug into a real API later.

export type Period = "dawn" | "morning" | "day" | "golden" | "dusk" | "night";
export type Weather = "clear" | "cloudy" | "rain";

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

export function currentWeather(now = new Date()): Weather {
  // Deterministic pseudo-weather from day-of-year so it changes but stays stable.
  const d = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const r = (d * 9301 + 49297) % 233280 / 233280;
  if (r < 0.15) return "rain";
  if (r < 0.4) return "cloudy";
  return "clear";
}

export function periodLabel(p: Period): string {
  return {
    dawn: "Dawn",
    morning: "Morning light",
    day: "Bright day",
    golden: "Golden hour",
    dusk: "Dusk",
    night: "Night",
  }[p];
}

export function greeting(p: Period): string {
  return {
    dawn: "Early light",
    morning: "Good morning",
    day: "Good afternoon",
    golden: "Golden hour",
    dusk: "Evening settles",
    night: "Quiet night",
  }[p];
}

/**
 * Overlay gradient + tint applied on top of the landscape photo to convey
 * the time of day. Deliberately subtle — never distracting.
 */
export function periodOverlay(p: Period): { gradient: string; tint: string; filter: string } {
  switch (p) {
    case "dawn":
      return {
        gradient: "linear-gradient(180deg, rgba(255,190,140,0.22) 0%, rgba(255,220,180,0.05) 45%, rgba(20,30,45,0.15) 100%)",
        tint: "rgba(255,180,130,0.08)",
        filter: "saturate(1.05) brightness(1.02)",
      };
    case "morning":
      return {
        gradient: "linear-gradient(180deg, rgba(255,240,210,0.15) 0%, rgba(255,255,255,0.02) 60%, rgba(0,0,0,0.05) 100%)",
        tint: "rgba(255,235,200,0.05)",
        filter: "saturate(1.05) brightness(1.05)",
      };
    case "day":
      return {
        gradient: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.02) 100%)",
        tint: "transparent",
        filter: "saturate(1.02) brightness(1.03)",
      };
    case "golden":
      return {
        gradient: "linear-gradient(180deg, rgba(255,180,110,0.22) 0%, rgba(255,200,140,0.08) 50%, rgba(120,60,30,0.12) 100%)",
        tint: "rgba(255,170,90,0.08)",
        filter: "saturate(1.1) brightness(1.02) contrast(1.02)",
      };
    case "dusk":
      return {
        gradient: "linear-gradient(180deg, rgba(180,140,180,0.25) 0%, rgba(90,80,120,0.15) 50%, rgba(20,25,45,0.35) 100%)",
        tint: "rgba(140,120,180,0.1)",
        filter: "saturate(0.95) brightness(0.85)",
      };
    case "night":
      return {
        gradient: "linear-gradient(180deg, rgba(10,20,40,0.55) 0%, rgba(15,25,50,0.5) 50%, rgba(0,10,25,0.6) 100%)",
        tint: "rgba(30,50,90,0.18)",
        filter: "saturate(0.85) brightness(0.55) contrast(1.05)",
      };
  }
}
