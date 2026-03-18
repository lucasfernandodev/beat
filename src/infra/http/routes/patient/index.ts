import type { FastifyInstance } from "fastify";
import { getPatientsRoute } from "./get-patients.ts";

export const ApiPatientsRoute = async (app: FastifyInstance) => {
  await app.register(getPatientsRoute)
}