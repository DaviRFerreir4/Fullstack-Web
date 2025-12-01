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
    const user = await prisma.user.findFirst({
      where: { email: userData.email },
    })

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

  it('should throw an authentication error', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        ...userData,
      })

    expect(response.statusCode).toBe(401)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('JWT not found')
  })

  it('should throw an authorization error', async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: userData.email,
      password: userData.password,
    })

    const userResponse = await request(app)
      .post('/users')
      .send({
        ...userData,
      })
      .auth(sessionResponse.body.token, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(401)
    expect(userResponse.body).toHaveProperty('message')
    expect(userResponse.body.message).toBe('Unauthorized')
  })
})
