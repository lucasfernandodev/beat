import type { Pressure } from "../../../../generated/prisma/client.ts";
import { classifyPressureEn } from "../../../utils/classify-pressure-en.ts";

export class PressureViewModel {
  static toHttp = (raw: Pressure) => {
    return {
      id: raw.id,
      systolic: raw.systolic,
      diastolic: raw.diastolic,
      heartRate: raw.heartRate,
      pressure: `${raw.systolic}/${raw.diastolic}`,
      classify: classifyPressureEn(raw.systolic, raw.diastolic)
    }
  }
}