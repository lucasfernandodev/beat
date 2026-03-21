import type { FastifyInstance } from "fastify";
import { createPressureRoute } from "./create-pressure.ts";
import { getPressureByDay } from "./get-pressure-by-day.ts";

export const ApiPressureRoute = async (app: FastifyInstance) => {
  await app.register(createPressureRoute)
  await app.register(getPressureByDay)
}