import { BaseError } from "./base-error.ts";
import { httpStatusCodes } from "./http-status-code.ts";

export class BadRequest extends BaseError {
  constructor(name: string,
    statusCode = httpStatusCodes.BAD_REQUEST,
    description = 'Bad Request',
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description)
  }
}