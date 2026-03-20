import type { PressureCategory } from "../types/api-session";

export function pressureCategoryToPtBr(category: PressureCategory): string {
  const map: Record<PressureCategory, string> = {
    low: "Baixa",
    normal: "Normal",
    elevated: "Elevada",
    hypertension_stage_1: "Hipertensão estágio 1",
    hypertension_stage_2: "Hipertensão estágio 2",
    hypertensive_crisis: "Crise hipertensiva",
  };

  return map[category];
}