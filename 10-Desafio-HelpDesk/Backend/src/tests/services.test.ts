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

  it('should list all services', async () => {
    const serviceResponse = await request(app)
      .get('/services')
      .auth(adminToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(200)
    expect(serviceResponse.body).toHaveProperty('services')
    expect(serviceResponse.body.services.length).toBeGreaterThan(0)
    expect(serviceResponse.body.services).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: serviceData.type,
          value: serviceData.value,
        }),
      ])
    )
    expect(serviceResponse.body).toHaveProperty('pagination')
  })

  it('should list services based on filters', async () => {
    const serviceResponse = await request(app)
      .get('/services')
      .query({ gt: 1500 })
      .auth(adminToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(200)
    expect(serviceResponse.body).toHaveProperty('services')
    expect(serviceResponse.body.services.length).toBe(0)
    expect(serviceResponse.body).toHaveProperty('pagination')
  })

  it('should update informations about the service', async () => {
    const serviceResponse = await request(app)
      .put(`/services/${servicesId[0]}`)
      .send({ type: 'Test Service 2', value: 12.1 })
      .auth(adminToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(200)
    expect(serviceResponse.body).toHaveProperty('id')
    expect(serviceResponse.body.type).toBe('Test Service 2')
  })

  it('should change the status of a service to inactive', async () => {
    const serviceResponse = await request(app)
      .patch(`/services/${servicesId[0]}/isActive`)
      .send({ isActive: false })
      .auth(adminToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(200)
    expect(serviceResponse.body).toHaveProperty('id')
    expect(serviceResponse.body.isActive).toBe(false)
  })
})
