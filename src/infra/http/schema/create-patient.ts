import z from 'zod'

export const createPatientSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome muito longo")
    .trim(),

  username: z
    .string()
    .min(3, "Username deve ter pelo menos 3 caracteres")
    .max(20, "Username muito longo")
    .regex(/^[a-zA-Z]+$/, "Username deve conter apenas letras (sem espaços ou números)")
    .toLowerCase(),

  databaseId: z.string().min(1, "DatabaseId é obrigatório")
});

export type PatientFormValues = z.infer<typeof createPatientSchema>