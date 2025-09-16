import { NextFunction, Request, Response } from 'express'

export default function myMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // console.log('Passou pelo Middleware!')
  request.user_id = '123456'

  return next()
}
