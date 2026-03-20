import type { FastifyTypedInstance } from "../../../../lib/fastify/server.ts";
import { prisma } from "../../../../lib/prisma/client.ts";
import { BadRequest } from "../../../errors/bad-request.ts";
import { createPressureSchema } from "../../schema/create-pressure.ts";

const schema = {
  schema: {
    body: createPressureSchema
  }
}


export const createPressureRoute = (app: FastifyTypedInstance) => {
  app.post('/pressures', schema, async (req, reply) => {
    const { username, pressure } = req.body;

    const isPatient = await prisma.patient.findFirst({
      where: { username }
    })

    if (!isPatient) {
      throw new BadRequest('Patient not found')
    }

    const lastSession = await prisma.measurementSession.findFirst({
      where: {
        patientId: isPatient.id
      },
      orderBy: {
        measuredAt: 'desc'
      }
    })

    if (lastSession) {
      const SESSION_WINDOW_MS = 5 * 60 * 1000; // 5 minutos
      const isSameSession = Math.abs(
        new Date(pressure.measuredAt).getTime() - lastSession.measuredAt.getTime()
      ) <= SESSION_WINDOW_MS;

      const newAnnotation = pressure.annotation;

      const mergedAnnotation =
        lastSession.annotation && newAnnotation
          ? `${lastSession.annotation}\n${newAnnotation}`
          : lastSession.annotation || newAnnotation;

      if (isSameSession) {
        await prisma.measurementSession.update({
          where: {
            id: lastSession.id,
            patientId: isPatient.id
          },
          data: {
            annotation: mergedAnnotation,
            pressures: {
              create: {
                systolic: pressure.systolic,
                diastolic: pressure.diastolic,
                heartRate: pressure.heartRate
              }
            }
          }
        })

        return reply.code(200).send({
          success: true
        })
      }
    }



    await prisma.measurementSession.create({
      data: {
        patientId: isPatient.id,
        measuredAt: new Date(pressure.measuredAt),
        annotation: pressure.annotation,
        pressures: {
          create: [
            {
              systolic: pressure.systolic,
              diastolic: pressure.diastolic,
              heartRate: pressure.heartRate
            }
          ]
        }
      }
    })

    return reply.code(201).send({
      success: true
    })
  })
}