import { AppError } from '@/utils/AppError.js'
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { authConfig } from '@/configs/auth.js'

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT não informado', 401)
  }

  const [, token] = authHeader.split(' ')

  const { sub: user_id } = jwt.verify(token, authConfig.jwt.secret)

  request.user = {
    id: String(user_id),
  }

  return next()
}

export { ensureAuthenticated }
