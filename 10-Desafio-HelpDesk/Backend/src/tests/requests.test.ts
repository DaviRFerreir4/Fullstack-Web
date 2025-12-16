import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'
import { serviceData, userData } from './utils/requestData'

describe('RequestsController', () => {
  let adminToken: string
  let usersToken: string[] = []
  let requestsId: number[] = []
  let servicesId: string[] = []
  let usersId: string[] = []

  beforeAll(async () => {
    const adminResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: 'Drowssap1.',
    })

    adminToken = adminResponse.body.token

    const users = [
      {
        ...userData,
      },
      {
        ...userData,
        email: 'test.user.technician@email.com',
      },
    ]

    for (const user of users) {
      const userResponse = await request(app)
        .post('/users')
        .send({ ...user })

      usersId.push(userResponse.body.id)

      const sessionResponse = await request(app)
        .post('/sessions')
        .send({ email: user.email, password: user.password })

      usersToken.push(sessionResponse.body.token)
    }

    const serviceResponse = await request(app)
      .post('/services')
      .send({ ...serviceData })
      .auth(adminToken, { type: 'bearer' })

    servicesId.push(serviceResponse.body.id)
  })

  afterAll(async () => {
    for (const id of requestsId) {
      await prisma.requestService.deleteMany({ where: { requestId: id } })
      await prisma.request.delete({ where: { id } })
    }

    for (const id of servicesId) {
      await prisma.service.delete({ where: { id } })
    }

    for (const id of usersId) {
      await prisma.user.delete({ where: { id } })
    }
  })

  it('should create a new request', async () => {
    const requestResponse = await request(app)
      .post('/requests')
      .send({ serviceId: servicesId[0], assignedTo: usersId[1] })
      .auth(usersToken[0], { type: 'bearer' })

    expect(requestResponse.statusCode).toBe(201)
    expect(requestResponse.body).toHaveProperty('id')

    requestsId.push(requestResponse.body.id)

    expect(requestResponse.body).toHaveProperty('requestedBy')
    expect(requestResponse.body).toHaveProperty('assignedTo')
    expect(requestResponse.body.assignedTo).toHaveProperty('id')
    expect(requestResponse.body.assignedTo.id).toBe(usersId[1])
    expect(requestResponse.body).toHaveProperty('service')
    expect(requestResponse.body.service).toHaveProperty('id')
    expect(requestResponse.body.service.id).toBe(servicesId[0])
  })

  it('should list all requests', async () => {
    const requestResponse = await request(app)
      .get('/requests')
      .auth(adminToken, { type: 'bearer' })

    expect(requestResponse.statusCode).toBe(200)
    expect(requestResponse.body.length).toBeGreaterThan(0)
    expect(requestResponse.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: requestsId[0] })])
    )
  })

  it('should show a specific request and all relevant data related to it', async () => {
    const requestResponse = await request(app)
      .get(`/requests/${requestsId[0]}`)
      .auth(adminToken, { type: 'bearer' })

    expect(requestResponse.statusCode).toBe(200)
    expect(requestResponse.body).toHaveProperty('id')
    expect(requestResponse.body).toHaveProperty('client')
    expect(requestResponse.body).toHaveProperty('technician')
    expect(requestResponse.body).toHaveProperty('services')
    expect(requestResponse.body).toHaveProperty('status')
    expect(requestResponse.body.status).toBe('opened')
  })
})
