import { prisma } from "../../../../lib/prisma/client.ts";
import { getPatientByUsername } from "../../schema/get-patient-by-username.ts";
import type { FastifyTypedInstance } from "../../../../lib/fastify/server.ts";
import { SessionViewModel } from "../../../view-models/session.ts";

const schema = {
  schema: {
    params: getPatientByUsername
  }
}

export const getPatientByUsernameRoute = async (app: FastifyTypedInstance) => {
  app.get('/patients/:username', schema, async (req, reply) => {
    const { username } = req.params;
    const isPatient = await prisma.patient.findFirst({
      where: {
        username
      },
      select: {
        name: true,
        username: true,
        sessions: {
          orderBy: {
            measuredAt: "desc"
          },
          take: 1,
          include: {
            pressures: true
          }
        }
      },
    })

    return reply.send({
      success: true,
      data: {
        ...isPatient,
        sessions: isPatient?.sessions.map(SessionViewModel.toHttp)
      }
    })
  })
}