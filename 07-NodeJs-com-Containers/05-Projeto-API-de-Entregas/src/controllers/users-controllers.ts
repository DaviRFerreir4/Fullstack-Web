import type { Request, Response } from 'express'

class UserControllers {
  create(request: Request, response: Response) {
    return response.status(201).json({ message: 'created' })
  }
}

export { UserControllers }
