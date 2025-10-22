import { Request, Response } from 'express'

class RefundsController {
  async create(request: Request, response: Response) {
    return response.status(201).json()
  }
}

export { RefundsController }
