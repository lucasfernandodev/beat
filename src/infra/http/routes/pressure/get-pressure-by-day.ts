import z from "zod";
import type { FastifyTypedInstance } from "../../../../lib/fastify/server.ts";
import { BadRequest } from "../../../errors/bad-request.ts";
import { prisma } from "../../../../lib/prisma/client.ts";
import { getDayRange } from "../../../../utils/get-day-range.ts";
import { SessionViewModel } from "../../view-models/session.ts";
import { createPatientSchema } from "../../schema/create-patient.ts";

const schema = {
  schema: {
    params: z.object({
      username: createPatientSchema.shape.username
    }),
    querystring: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
    })
  }
}

export const getPressureByDay = async (app: FastifyTypedInstance) => {
  app.get('/patients/:username/pressures', schema, async (req, reply) => {
    const { username } = req.params;
    const { date } = req.query;

    if (!date) {
      throw new BadRequest('Query "date" é obrigatória (YYYY-MM-DD)')
    }

    const isPatient = await prisma.patient.findUnique({
      where: {
        username
      }
    })

    if (!isPatient) {
      throw new BadRequest('Paciente não encontrado')
    }

    const { start, end } = getDayRange(date)

    const pressures = await prisma.measurementSession.findMany({
      where: {
        patientId: isPatient.id,
        createdAt: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        pressures: true
      }
    })

    return reply.send({
      success: true,
      data: pressures.map(SessionViewModel.toHttp)
    })
  })
}