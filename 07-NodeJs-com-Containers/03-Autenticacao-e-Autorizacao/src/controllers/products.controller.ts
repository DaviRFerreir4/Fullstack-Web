import type { Request, Response } from 'express'

class ProductsControllers {
  async index(request: Request, response: Response) {
    return response.json()
  }

  async create(request: Request, response: Response) {
    return response.status(201).json({ message: request.user?.id })
  }
}

export { ProductsControllers }
