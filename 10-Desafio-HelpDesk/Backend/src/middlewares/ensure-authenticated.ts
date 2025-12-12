import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { Role } from '@prisma/client'
import { AppError } from '../utils/app-error'
import { authConfig } from '../configs/auth'
import { prisma } from '../database/prisma'

interface TokenPayload {
  role: Role
  sub: string
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT não encontrado')
  }

  const [, token] = authHeader.split(' ')

  const { role, sub: user_id } = jwt.verify(
    token,
    authConfig.secret
  ) as TokenPayload

  const user = await prisma.user.findUnique({ where: { id: user_id } })

  if (!user) {
    throw new AppError('O usuário informado no JWT não existe')
  }

  request.user = {
    id: user_id,
    role,
  }

  next()
}
