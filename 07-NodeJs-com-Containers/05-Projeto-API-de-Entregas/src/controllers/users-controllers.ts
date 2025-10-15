import type { Request, Response } from 'express'
import { z } from 'zod'

class UserControllers {
  create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim(),
      email: z.string().trim().email(),
      password: z.string().trim().min(6),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    return response.status(201).json({ message: 'created' })
  }
}

export { UserControllers }
