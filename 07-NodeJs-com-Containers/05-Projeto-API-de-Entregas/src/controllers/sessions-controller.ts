import { Request, Response } from 'express'

class SessionsController {
  create(request: Request, response: Response) {
    return response.status(201).json()
  }
}

export { SessionsController }
