import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'

describe('SessionsController', () => {
  let token: string

  const userData = {
    name: 'Auth Test User',
    email: 'auth_test_user@example.com',
    password: '12345678',
    confirm_password: '12345678',
  }

  beforeAll(async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: '12345678',
    })

    token = sessionResponse.body.token
  })

  afterAll(async () => {
    const user = await prisma.user.findFirst({ where: { name: userData.name } })

    if (!user) {
      return
    }

    await prisma.user.delete({ where: { id: user.id } })
  })

  it('should authenticate and return user and token info', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({
        ...userData,
      })
      .auth(token, { type: 'bearer' })

    const sessionResponse = await request(app).post('/sessions').send({
      email: userData.email,
      password: userData.password,
    })

    expect(sessionResponse.statusCode).toBe(201)
    expect(sessionResponse.body).toHaveProperty('user')
    expect(sessionResponse.body).toHaveProperty('token')
  })
})
