import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'
import { userData } from './utils/requestData'

describe('UsersController', () => {
  let adminToken

  beforeAll(async () => {
    const adminResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: 'Drowssap1.',
    })

    adminToken = adminResponse.body.token
  })

  afterAll(async () => {
    await prisma.user.delete({ where: { email: userData.email } })
  })

  it('should create a new user successfully', async () => {
    const userResponse = await request(app).post('/users').send(userData)

    expect(userResponse.statusCode).toBe(201)
    expect(userResponse.body).toHaveProperty('user')
    expect(userResponse.body.user).toEqual(
      expect.objectContaining({ name: userData.name, email: userData.email })
    )
  })
})
