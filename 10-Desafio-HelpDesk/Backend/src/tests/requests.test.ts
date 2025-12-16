import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'
import { User } from '@prisma/client'
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

    const users: Partial<User>[] & { confirmPassword: string }[] = [
      {
        ...userData,
      },
      {
        ...userData,
        email: 'test.user.technician@email.com',
        role: 'technician',
        availableHours: [8, 9, 10, 11, 13, 14, 15, 16],
      },
    ]

    for (const user of users) {
      const userResponse = await request(app)
        .post(user?.role === 'technician' ? '/users/technician' : '/users')
        .send({ ...user })
        .auth(adminToken, { type: 'bearer' })

      usersId.push(userResponse.body.id)

      const sessionResponse = await request(app)
        .post('/sessions')
        .send({ email: user.email, password: user.password })

      usersToken.push(sessionResponse.body.token)
    }

    const services = [
      {
        ...serviceData,
      },
      {
        type: 'Test Service 2',
        value: 12.1,
      },
    ]

    for (const service of services) {
      const serviceResponse = await request(app)
        .post('/services')
        .send({ ...service })
        .auth(adminToken, { type: 'bearer' })

      servicesId.push(serviceResponse.body.id)
    }
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
      const user = await prisma.user.findFirst({ where: { id } })

      if (user && user.role === 'technician') {
        await prisma.openingHour.delete({ where: { userId: id } })
      }

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

  it('should add another service to a request', async () => {
    const requestResponse = await request(app)
      .post(`/requests/${requestsId[0]}`)
      .send({ serviceId: servicesId[1] })
      .auth(usersToken[1], { type: 'bearer' })

    expect(requestResponse.statusCode).toBe(201)
    expect(requestResponse.body).toHaveProperty('id')
    expect(requestResponse.body).toHaveProperty('services')
    expect(requestResponse.body.services.length).toBeGreaterThan(1)
  })

  it('should change the request status', async () => {
    const requestResponse = await request(app)
      .patch(`/requests/${requestsId[0]}/status`)
      .send({ status: 'in_progress' })
      .auth(usersToken[1], { type: 'bearer' })

    expect(requestResponse.statusCode).toBe(200)
    expect(requestResponse.body).toHaveProperty('id')
    expect(requestResponse.body).toHaveProperty('status')
    expect(requestResponse.body.status).toBe('in_progress')
  })

  it('should throw an authentication error', async () => {
    const requestResponse = await request(app)
      .post('/requests')
      .send({ serviceId: servicesId[1], assignedTo: usersId[1] })

    expect(requestResponse.statusCode).toBe(400)
    expect(requestResponse.body).toHaveProperty('message')
    expect(requestResponse.body.message).toBe('JWT não encontrado')
  })

  it('should throw an authorization error when trying to interact with routes that require admin credentials', async () => {
    const requestResponse = await request(app)
      .get('/requests')
      .auth(usersToken[0], { type: 'bearer' })

    expect(requestResponse.statusCode).toBe(401)
    expect(requestResponse.body).toHaveProperty('message')
    expect(requestResponse.body.message).toBe('Não autorizado')
  })

  it('should throw an authorization error when trying to interact with routes that require client credentials', async () => {
    const requestResponse = await request(app)
      .post('/requests')
      .send({ serviceId: servicesId[1], assignedTo: usersId[1] })
      .auth(adminToken, { type: 'bearer' })

    expect(requestResponse.statusCode).toBe(401)
    expect(requestResponse.body).toHaveProperty('message')
    expect(requestResponse.body.message).toBe('Não autorizado')
  })

  it('should throw an authorization error when trying to interact with routes that require technician credentials', async () => {
    const requestResponse = await request(app)
      .post(`/requests/${requestsId[0]}`)
      .send({ serviceId: servicesId[0] })
      .auth(usersToken[0], { type: 'bearer' })

    expect(requestResponse.statusCode).toBe(401)
    expect(requestResponse.body).toHaveProperty('message')
    expect(requestResponse.body.message).toBe('Não autorizado')
  })

  it('should throw a validation error when sending wrong data in the request body', async () => {
    const requestResponse = await request(app)
      .post('/requests')
      .send({ assignedTo: 'akglsa-gara2-ghg-a3', serviceId: true })
      .auth(usersToken[0], { type: 'bearer' })

    expect(requestResponse.statusCode).toBe(400)
    expect(requestResponse.body).toHaveProperty('message')
    expect(requestResponse.body.message).toBe('Erro de validação')
    expect(requestResponse.body).toHaveProperty('issues')
    expect(requestResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: ['assignedTo'] }),
        expect.objectContaining({ path: ['serviceId'] }),
      ])
    )
  })
})
