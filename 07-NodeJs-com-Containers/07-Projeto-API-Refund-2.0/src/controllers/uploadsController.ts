import { Request, Response } from 'express'

class UploadsController {
  async create(request: Request, response: Response) {
    return response.status(201).json()
  }
}

export { UploadsController }
