import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'
import { serviceData, userData } from './utils/requestData'

describe('ServicesController', () => {
  let adminToken: string
  let userToken: string
  let servicesId: string[] = []
  let usersId: string[] = []

  beforeAll(async () => {
    const adminResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: 'Drowssap1.',
    })

    adminToken = adminResponse.body.token

    const userResponse = await request(app)
      .post('/users')
      .send({ ...userData })

    usersId.push(userResponse.body.id)

    const sessionResponse = await await request(app)
      .post('/sessions')
      .send({ email: userData.email, password: userData.password })

    userToken = sessionResponse.body.token
  })

  afterAll(async () => {
    for (const id of servicesId) {
      await prisma.service.delete({ where: { id } })
    }

    for (const id of usersId) {
      await prisma.user.delete({ where: { id } })
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

  it('should throw an authentication error when trying to interact with services without any JWT', async () => {
    const serviceResponse = await request(app)
      .post('/services')
      .send({ ...serviceData })

    expect(serviceResponse.statusCode).toBe(400)
    expect(serviceResponse.body).toHaveProperty('message')
    expect(serviceResponse.body.message).toBe('JWT não encontrado')
  })

  it('should throw an authorization error when trying to interact with routes that require admin credentials', async () => {
    const serviceResponse = await request(app)
      .post('/services')
      .auth(userToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(401)
    expect(serviceResponse.body).toHaveProperty('message')
    expect(serviceResponse.body.message).toBe('Não autorizado')
  })

  it('should throw a validation error when sending wrong query params', async () => {
    const serviceResponse = await request(app)
      .get('/services')
      .query({ gt: true, isActive: 'Test' })
      .auth(adminToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(400)
    expect(serviceResponse.body).toHaveProperty('message')
    expect(serviceResponse.body.message).toBe('Erro de validação')
    expect(serviceResponse.body).toHaveProperty('issues')
    expect(serviceResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: expect.arrayContaining(['gt']) }),
      ])
    )
  })

  it('should throw a validation error when sending wrong data in the request body', async () => {
    const serviceResponse = await request(app)
      .post('/services')
      .send({ type: 45, value: 'Test' })
      .auth(adminToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(400)
    expect(serviceResponse.body).toHaveProperty('message')
    expect(serviceResponse.body.message).toBe('Erro de validação')
    expect(serviceResponse.body).toHaveProperty('issues')
    expect(serviceResponse.body.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['type'] })])
    )
    expect(serviceResponse.body.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ path: ['value'] })])
    )
  })

  it('should throw an error when sending a non existing service as a route param', async () => {
    const serviceResponse = await request(app)
      .put('/services/77332d88-b562-4047-ade0-73eecfaac90a')
      .auth(adminToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(400)
    expect(serviceResponse.body).toHaveProperty('message')
    expect(serviceResponse.body.message).toBe('Serviço não encontrado')
  })

  it('should throw an error when sending no data in an user put request', async () => {
    const serviceResponse = await request(app)
      .put(`/services/${servicesId[0]}`)
      .send({})
      .auth(adminToken, { type: 'bearer' })

    expect(serviceResponse.statusCode).toBe(400)
    expect(serviceResponse.body).toHaveProperty('message')
    expect(serviceResponse.body.message).toContain(
      'Informe algum dado a ser atualizado'
    )
  })
})
