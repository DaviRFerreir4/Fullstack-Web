import { Request, Response, NextFunction } from 'express'

import { AppError } from '../../utils/app-error'

export function verifyUserAuthorization(roles: IUserRole[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    if (!request.user || !roles.includes(request.user.role)) {
      throw new AppError('Unauthorized', 401)
    }

    return next()
  }
}
