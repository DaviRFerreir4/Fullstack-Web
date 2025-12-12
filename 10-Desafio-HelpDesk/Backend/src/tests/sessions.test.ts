import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'

describe('SessionsController', () => {
  const userData = {
    name: 'Test User',
    email: 'test.user@email.com',
    password: 'TestPassword123.',
    confirm_password: 'TestPassword123.',
  }

  beforeAll(async () => {
    await request(app)
      .post('/users')
      .send({
        ...userData,
      })
  })

  afterAll(async () => {
    await prisma.user.delete({ where: { email: userData.email } })
  })

  it('should authenticate and return the user and JWT info', async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: userData.email,
      password: userData.password,
    })

    console.log(sessionResponse.body)

    expect(sessionResponse.statusCode).toBe(201)
    expect(sessionResponse.body).toHaveProperty('token')
    expect(sessionResponse.body).toHaveProperty('user')
  })

  it('should throw a validation error', async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: 'asd',
      password: 12,
    })

    expect(sessionResponse.statusCode).toBe(400)
    expect(sessionResponse.body).toHaveProperty('message')
    expect(sessionResponse.body).toHaveProperty('issues')
    expect(sessionResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: expect.arrayContaining(['email']) }),
      ])
    )
    expect(sessionResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: expect.arrayContaining(['password']) }),
      ])
    )
    expect(sessionResponse.body.message).toBe('Erro de validação')
  })

  it('should throw an error about wrong email or password', async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: 'test@eamil.com',
      password: userData.password,
    })

    expect(sessionResponse.statusCode).toBe(400)
    expect(sessionResponse.body).toHaveProperty('message')
    expect(sessionResponse.body.message).toBe('E-mail ou senha errados')
  })
})
