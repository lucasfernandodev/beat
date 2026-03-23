export type PressureCategory =
  | "low"
  | "normal"
  | "elevated"
  | "hypertension_stage_1"
  | "hypertension_stage_2"
  | "hypertensive_crisis";

export type DayPeriod =
  | "early_morning"
  | "morning"
  | "afternoon"
  | "evening";

export interface ApiPressure {
  id: string;
  systolic: number;
  diastolic: number,
  heartRate: number,
  pressure: string,
}

export interface ApiSession {
  id: string;
  patientId: string;
  measuredAt: string;
  annotation: string | null;
  period: DayPeriod,
  pressures: ApiPressure[]
}