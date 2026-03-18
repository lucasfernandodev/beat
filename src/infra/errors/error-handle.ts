import { BaseError } from "./base-error.ts"

export function isOperationalError(error: unknown) {
  if (error instanceof BaseError) {
    return error.isOperational
  }
  return false
}