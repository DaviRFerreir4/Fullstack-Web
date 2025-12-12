import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'
import { userData } from './utils/requestData'

describe('UsersController', () => {
  let adminToken: string
  let userId: string

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

    userId = userResponse.body.user.id

    expect(userResponse.statusCode).toBe(201)
    expect(userResponse.body).toHaveProperty('user')
    expect(userResponse.body.user).toEqual(
      expect.objectContaining({ name: userData.name, email: userData.email })
    )
  })

  it('should list all users', async () => {
    const userResponse = await request(app)
      .get('/users')
      .auth(adminToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(200)
    expect(userResponse.body).toHaveProperty('users')
    expect(userResponse.body.users.length).toBeGreaterThan(0)
    expect(userResponse.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: userData.name,
          email: userData.email,
        }),
      ])
    )
  })

  it('should show only one user', async () => {
    const userResponse = await request(app)
      .get(`/users/${userId}`)
      .auth(adminToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(200)
    expect(userResponse.body).toHaveProperty('id')
    expect(userResponse.body).toEqual(
      expect.objectContaining({ name: userData.name, email: userData.email })
    )
  })
})
