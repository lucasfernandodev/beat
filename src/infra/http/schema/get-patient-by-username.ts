import z from "zod";
import { createPatientSchema } from "./create-patient.ts";

export const getPatientByUsername = z.object({
  username: createPatientSchema.shape.username
})