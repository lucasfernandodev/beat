export type DayPeriod =
  | "early_morning"
  | "morning"
  | "afternoon"
  | "evening";

export function getDayPeriod(date: Date): DayPeriod {
  const hour = date.getHours();

  if (hour >= 6 && hour <= 11) {
    return "morning";
  }

  if (hour >= 12 && hour <= 17) {
    return "afternoon";
  }

  if (hour >= 18 && hour <= 23) {
    return "evening";
  }

  return "early_morning";
}