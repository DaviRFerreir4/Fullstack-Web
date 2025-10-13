import { AppError } from '@/utils/AppError.js'
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { authConfig } from '@/configs/auth.js'

interface TokenPayload {
  sub: string
  role: string
}

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

  const { sub: user_id, role } = jwt.verify(
    token,
    authConfig.jwt.secret
  ) as TokenPayload

  request.user = {
    id: String(user_id),
    role,
  }

  return next()
}

export { ensureAuthenticated }
