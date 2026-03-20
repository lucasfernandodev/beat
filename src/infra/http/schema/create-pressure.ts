import z from "zod";
import { createPatientSchema } from "./create-patient.ts";

// systolic/diastolic
export const createPressureSchema = z.object({
  username: createPatientSchema.shape.username,
  pressure: z.object({
    measuredAt: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Data inválida",
      })
      .transform((val) => new Date(val)),

    annotation: z
      .string()
      .max(500, "Máximo 500 caracteres")
      .optional(),

    systolic: z.coerce.number().int({
      message: "Sistólica deve ser um número inteiro",
    }),

    diastolic: z.coerce.number().int({
      message: "Diastólica deve ser um número inteiro",
    }),

    heartRate: z
      .union([z.coerce.number().int(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
  })
})