import request from 'supertest'
import 'express-async-errors'
import { app } from '@/app'

describe('UsersController', () => {
  it('should create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'Test User',
      email: 'testuser@email.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Test User')
  })
})
