import z from "zod";

export const createPressureSchema = z.object({
  measuredAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Data inválida"
    }),
  annotation: z
    .string()
    .max(500, "Máximo 500 caracteres")
    .optional(),
  systolic: z
    .coerce.number({
      message: "Sistólica deve ser número"
    }).min(1, { message: 'Não deixe o campo vazio' }).int(),

  diastolic: z.coerce
    .number({
      message: "Diastólica deve ser número"
    }).min(1, { message: 'Não deixe o campo vazio' }).int(),

  heartRate: z.coerce
    .number({
      message: "Frequência cardíaca deve ser número"
    })
    .int()
    .optional(),
})

export type PressureFormValues = z.infer<typeof createPressureSchema>