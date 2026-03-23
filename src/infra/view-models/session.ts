import type { Prisma } from "../../../generated/prisma/client.ts";
import { getDayPeriod } from "../../utils/get-day-period.ts";
import { PressureViewModel } from "./pressure.ts";

type MeasurementSessionOptionalPressures =
  Prisma.MeasurementSessionGetPayload<{
    include: { pressures?: true };
  }>;

export class SessionViewModel {
  static toHttp = (raw: MeasurementSessionOptionalPressures) => {
    return {
      id: raw.id,
      patientId: raw.patientId,
      measuredAt: raw.measuredAt,
      annotation: raw?.annotation || null,
      period: getDayPeriod(raw.measuredAt),
      pressures: raw.pressures
        ? raw.pressures.map(PressureViewModel.toHttp)
        : []
    }
  }
}