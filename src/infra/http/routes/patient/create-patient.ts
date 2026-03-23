import type { FastifyTypedInstance } from "../../../../lib/fastify/server.ts";
import { prisma } from '../../../../lib/prisma/client.ts';
import { BadRequest } from '../../../errors/bad-request.ts';
import { SetupNotionForUserService } from "../../../service/setup-notion-for-user.ts";
import { createPatientSchema } from '../../schema/create-patient.ts';

const schema = {
  schema: {
    body: createPatientSchema
  }
}

export const createPatientRoute = (app: FastifyTypedInstance) => {
  app.post('/patients', schema, async (req, reply) => {
    const { name, username, databaseId } = req.body;

    const isUsername = await prisma.patient.findFirst({
      where: {
        username
      }
    })

    if (isUsername) {
      throw new BadRequest('Nome de usuário já está em uso')
    }

    const service = new SetupNotionForUserService()
    await service.execute(databaseId)

    await prisma.patient.create({
      data: {
        name,
        username,
        cloudDatabaseId: databaseId
      }
    })


    return reply.code(201).send({ success: true })
  })
}