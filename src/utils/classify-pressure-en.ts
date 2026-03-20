export type PressureCategory =
  | "low"
  | "normal"
  | "elevated"
  | "hypertension_stage_1"
  | "hypertension_stage_2"
  | "hypertensive_crisis";

export function classifyPressureEn(systolic: number, diastolic: number): PressureCategory {
  // 🔻 Baixa
  if (systolic < 90 || diastolic < 60) {
    return "low";
  }

  // 🔺 Muito alta
  if (systolic >= 180 || diastolic >= 120) {
    return "hypertensive_crisis";
  }

  if (systolic >= 140 || diastolic >= 90) {
    return "hypertension_stage_2";
  }

  if (systolic >= 130 || diastolic >= 80) {
    return "hypertension_stage_1";
  }

  if (systolic >= 120 && diastolic < 80) {
    return "elevated";
  }

  return "normal";
}