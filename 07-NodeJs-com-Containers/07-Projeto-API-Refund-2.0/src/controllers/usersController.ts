import { AppError } from '@/utils/AppError.js'
import type { Request, Response } from 'express'

class UserController {
  async create(request: Request, response: Response) {
    throw new AppError('tese')
    return response.status(201).json()
  }
}

export { UserController }
