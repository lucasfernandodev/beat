import z from "zod";
import type { FastifyTypedInstance } from "../../../../lib/fastify/server.ts";
import { createPatientSchema } from "../../schema/create-patient.ts";
import { prisma } from "../../../../lib/prisma/client.ts";
import { BadRequest } from "../../../errors/bad-request.ts";

const schema = {
  schema: {
    params: z.object({
      username: createPatientSchema.shape.username
    })
  }
}

export const getCountPendingPressure = async (app: FastifyTypedInstance) => {
  app.get('/patients/:username/pressures/pending/count', schema, async (req, reply) => {
    const { username } = req.params;

    const isPatient = await prisma.patient.findFirst({
      where: { username }
    })

    if (!isPatient) {
      throw new BadRequest('Patient not found')
    }

    const count = await prisma.measurementSession.count({
      where: {
        syncStatus: 'PENDING',
        patientId: isPatient.id
      }
    })

    return reply.send({
      success: true,
      data: count
    })
  })
}