import { AppError } from '@/utils/AppError.js'
import type { Request, Response, NextFunction } from 'express'

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError("JWT não informado", 401)
  }

  const [, token] = authHeader.split(" ")

  return next()
}

export { ensureAuthenticated }
