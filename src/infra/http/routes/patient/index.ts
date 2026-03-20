import type { FastifyInstance } from "fastify";
import { getPatientsRoute } from "./get-patients.ts";
import { createPatientRoute } from "./create-patient.ts";
import { getPatientByUsernameRoute } from "./get-patient-by-username.ts";

export const ApiPatientsRoute = async (app: FastifyInstance) => {
  await app.register(getPatientsRoute)
  await app.register(createPatientRoute)
  await app.register(getPatientByUsernameRoute)
}