import { AppError } from '@/utils/AppError.js'

import { Request, Response, NextFunction } from 'express'

function verifyUserAuthorization(roles: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.role)) {
      throw new AppError('Não autorizado', 401)
    }

    return next()
  }
}

export { verifyUserAuthorization }
