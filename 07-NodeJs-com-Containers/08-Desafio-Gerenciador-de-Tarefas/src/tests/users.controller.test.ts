import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'

describe('UsersController', () => {
  let token: string

  beforeAll(async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: '12345678',
    })

    token = sessionResponse.body.token
  })

  afterAll(async () => {
    const user = await prisma.user.findFirst({ where: { name: 'Test User' } })

    if (!user) {
      return
    }

    await prisma.user.delete({ where: { id: user.id } })
  })

  it('should create a new user successfully', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: '12345678',
        confirm_password: '12345678',
      })
      .auth(token, { type: 'bearer' })

    expect(response.statusCode).toBe(201)
  })
})
