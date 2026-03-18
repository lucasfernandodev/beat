import { z } from 'zod';
import type { FastifyTypedInstance } from "../../../../lib/fastify/server.ts";
import { prisma } from '../../../../lib/prisma/client.ts';
import { BadRequest } from '../../../errors/bad-request.ts';

const validation = z.object({
  name: z.string(),
  username: z.string(),
  databaseId: z.string()
})

const schema = {
  schema: {
    body: validation
  }
}

export const createPatientRoute = (app: FastifyTypedInstance) => {
  app.post('/patients', schema, async (req, reply) => {
    const { name, username, databaseId } = req.body;

    const isUsername = prisma.patient.findFirst({
      where: {
        username
      }
    })

    if (!isUsername) {
      throw new BadRequest('Nome de usuário já está em uso')
    }

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