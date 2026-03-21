import type { DayPeriod } from "../types/api-session";

export function dayPeriodToPtBr(period: DayPeriod): string {
  const map: Record<DayPeriod, string> = {
    early_morning: "Madrugada",
    morning: "Manhã",
    afternoon: "Tarde",
    evening: "Noite",
  };

  return map[period];
}