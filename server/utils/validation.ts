import { z } from 'zod'

/** Unwraps a Zod safeParse result from readValidatedBody, or rejects the request with 422 and field errors. */
export function assertValid<T>(result: z.ZodSafeParseResult<T>): T {
  if (result.success) return result.data
  throw createError({
    statusCode: 422,
    statusMessage: 'Validation failed',
    data: z.flattenError(result.error).fieldErrors
  })
}
