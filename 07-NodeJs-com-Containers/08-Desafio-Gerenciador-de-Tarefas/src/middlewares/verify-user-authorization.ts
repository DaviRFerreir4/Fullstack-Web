import { Request, Response, NextFunction } from 'express'

import { UserRole } from '../database/generate/client'
import { AppError } from '../utils/app-error'

export function verifyUserAuthorization(roles: UserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.role)) {
      throw new AppError('Unauthorized', 401)
    }

    return next()
  }
}
