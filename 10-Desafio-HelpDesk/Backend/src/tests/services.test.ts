import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'
import { serviceData } from './utils/requestData'

describe('ServicesController', () => {
  let adminToken: string
  let servicesId: string[] = []

  beforeAll(async () => {
    const adminResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: 'Drowssap1.',
    })

    adminToken = adminResponse.body.token
  })

  afterAll(async () => {
    for (const id of servicesId) {
      await prisma.service.delete({ where: { id } })
    }
  })

  it('should create a new service', async () => {
    const serviceResponse = await request(app)
      .post('/services')
      .send({ ...serviceData })
      .auth(adminToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(201)
    expect(serviceResponse.body).toHaveProperty('id')
    expect(serviceResponse.body.type).toBe(serviceData.type)

    servicesId.push(serviceResponse.body.id)
  })
})
