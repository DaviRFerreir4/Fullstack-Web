import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

import { UserRole } from '../database/generate/client'
import { authConfig } from '../configs/auth'
import { AppError } from '../../utils/app-error'

interface TokenPayload {
  role: UserRole
  sub: string
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError('JWT not found', 401)
    }

    const [, token] = authHeader.split(' ')

    const { role, sub: user_id } = jwt.verify(
      token,
      authConfig.jwt.secret
    ) as TokenPayload

    request.user = {
      id: user_id,
      role,
    }

    next()
  } catch (error) {
    next(error)
  }
}
