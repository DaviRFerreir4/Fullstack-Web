import type { Request, Response } from 'express'

class UsersController {
  index(request: Request, response: Response) {
    return response.json()
  }

  create(request: Request, response: Response) {
    return response.status(201).json()
  }

  show(request: Request, response: Response) {
    return response.json()
  }
}

export { UsersController }
