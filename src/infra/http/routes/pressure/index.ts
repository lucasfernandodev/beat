import type { FastifyInstance } from "fastify";
import { createPressureRoute } from "./create-pressure.ts";

export const ApiPressureRoute = async (app: FastifyInstance) => {
  await app.register(createPressureRoute)
}