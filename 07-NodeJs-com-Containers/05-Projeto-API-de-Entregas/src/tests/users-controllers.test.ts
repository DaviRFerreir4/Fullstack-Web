import request from 'supertest'
import 'express-async-errors'
import { app } from '@/app'
import { prisma } from '@/database/prisma'

describe('UsersController', () => {
  let user_id: string

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } })
  })

  it('should create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Test User',
      email: 'testuser@email.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Test User')

    user_id = response.body.id
  })

  it('should throw an error if user with same email alread exists', async () => {
    const response = await request(app).post('/users').send({
      name: 'Another User',
      email: 'testuser@email.com',
      password: 'password321',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('user with same email already exists')
  })

  it('should thorw a validation error if email is invalid', async () => {
    const response = await request(app).post('/users').send({
      name: 'Test User',
      email: 'invalid-email',
      password: 'password321',
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toHaveProperty('issues')
    expect(response.body.message).toBe('validation error')
  })
})
