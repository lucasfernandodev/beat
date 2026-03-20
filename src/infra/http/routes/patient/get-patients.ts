import type { FastifyInstance } from "fastify";
import { prisma } from "../../../../lib/prisma/client.ts";

export const getPatientsRoute = async (app: FastifyInstance) => {
  app.get('/patients', async (_, reply) => {
    const allPatients = await prisma.patient.findMany({
      select: {
        name: true,
        username: true
      }
    })
    return reply.send({
      success: true,
      data: allPatients
    })
  })
}