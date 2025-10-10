import type { Request, Response } from 'express'

class QuestionsController {
  index(request: Request, response: Response) {
    return response.json()
  }

  create(request: Request, response: Response) {
    return response.status(201).json()
  }

  update(request: Request, response: Response) {
    return response.json()
  }

  remove(request: Request, response: Response) {
    return response.json()
  }
}

export { QuestionsController }
