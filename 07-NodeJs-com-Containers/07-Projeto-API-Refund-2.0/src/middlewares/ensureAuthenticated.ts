import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UserRole } from '@prisma/client'
import { authConfig } from '@/configs/auth.js'
import { AppError } from '@/utils/AppError.js'

interface TokenPayload {
  role: UserRole
  sub: string
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader) {
      throw new AppError('JWT não encontrado', 401)
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

export { ensureAuthenticated }
