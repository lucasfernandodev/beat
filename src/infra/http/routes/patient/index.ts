import type { FastifyInstance } from "fastify";
import { getPatientsRoute } from "./get-patients.ts";
import { createPatientRoute } from "./create-patient.ts";

export const ApiPatientsRoute = async (app: FastifyInstance) => {
  await app.register(getPatientsRoute)
  await app.register(createPatientRoute)
}