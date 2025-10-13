import type { Request, Response } from 'express'
import { AppError } from '@/utils/AppError.js'
import { authConfig } from '@/configs/auth.js'
import jwt from 'jsonwebtoken'

class SessionsControllers {
  async create(request: Request, response: Response) {
    const fakeUser = {
      id: '1',
      username: 'Davi',
      password: '123456',
    }

    const { username, password } = request.body

    if (username !== fakeUser.username || password !== fakeUser.password) {
      throw new AppError('Usuário e/ou senha estão incorretos', 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const token = jwt.sign({}, secret, {
      expiresIn,
      subject: String(fakeUser.id),
    })

    return response.status(201).json({ token: token })
  }
}

export { SessionsControllers }
