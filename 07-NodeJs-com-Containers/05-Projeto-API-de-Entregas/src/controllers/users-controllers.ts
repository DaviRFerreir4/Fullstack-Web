import type { Request, Response } from 'express'
import { hash } from 'bcrypt'
import { z } from 'zod'

class UserControllers {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim(),
      email: z.string().trim().email(),
      password: z.string().trim().min(6),
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const hashedPassword = await hash(password, 8)

    return response
      .status(201)
      .json({ message: 'created', password: hashedPassword })
  }
}

export { UserControllers }
