import type { FastifyReply } from "fastify";
import fastify from "fastify";
import { hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { BadRequest } from "../../infra/errors/bad-request.ts";

export const fastifyErrorHandle = async (error: unknown, _: any, reply: FastifyReply) => {
  if (
    error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE ||
    error instanceof fastify.errorCodes.FST_ERR_VALIDATION
  ) {
    return reply.code(400).send({
      success: false,
      error: {
        title: 'Bad Request',
        message: error.message,
      },
    })
  }

  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.code(400).send({
      success: false,
      error: {
        title: 'Invalid value',
        message: error.validation[0].message,
      },
    })
  }

  if (error instanceof BadRequest) {
    return reply.code(400).send({
      success: false,
      error: {
        title: 'Bad Request',
        message: error.name,
      },
    })
  }

  console.error('An unknown error has been found', error)

  return reply.code(500).send({
    success: false,
    error: {
      title: 'Unknown server error',
      message: 'An unknown error has been found',
    },
  })
}