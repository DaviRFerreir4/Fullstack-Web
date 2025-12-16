import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'
import { userData } from './utils/requestData'

describe('UsersController', () => {
  let adminToken: string
  let userToken: string
  let usersId: string[] = []

  beforeAll(async () => {
    const adminResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: 'Drowssap1.',
    })

    adminToken = adminResponse.body.token
  })

  afterAll(async () => {
    for (const id of usersId) {
      const user = await prisma.user.findUnique({ where: { id } })

      if (user && user.role === 'technician') {
        await prisma.openingHour.delete({ where: { userId: id } })
      }

      await prisma.user.delete({ where: { id } })
    }
  })

  it('should create a new user successfully', async () => {
    const userResponse = await request(app).post('/users').send(userData)

    expect(userResponse.statusCode).toBe(201)
    expect(userResponse.body).toHaveProperty('id')
    expect(userResponse.body).toEqual(
      expect.objectContaining({ name: userData.name, email: userData.email })
    )

    usersId.push(userResponse.body.id)
  })

  it('should create a technician user', async () => {
    const userResponse = await request(app)
      .post('/users/technician')
      .send({
        ...userData,
        email: 'test.user2@email.com',
        role: 'technician',
        availableHours: [8, 9, 10, 12, 13, 14, 15, 16],
      })
      .auth(adminToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(201)
    expect(userResponse.body).toHaveProperty('id')
    expect(userResponse.body).toEqual(
      expect.objectContaining({ role: 'technician' })
    )

    usersId.push(userResponse.body.id)
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
    const sessionResponse = await request(app)
      .post('/sessions')
      .send({ email: userData.email, password: userData.password })

    userToken = sessionResponse.body.token

    const userResponse = await request(app)
      .get(`/users/${usersId[0]}`)
      .auth(userToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(200)
    expect(userResponse.body).toHaveProperty('id')
    expect(userResponse.body).toEqual(
      expect.objectContaining({ name: userData.name, email: userData.email })
    )
  })

  it('should update information about the user', async () => {
    const userResponse = await request(app)
      .put(`/users/${usersId[0]}`)
      .send({
        name: 'Test User Update',
        email: 'roberto@email.com',
        password: 'TestUpdatePassword2.',
        confirmPassword: 'TestUpdatePassword2.',
      })
      .auth(userToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(200)
    expect(1).toBe(1)
  })

  it('should delete an user', async () => {
    const user = await request(app)
      .post('/users')
      .send({ ...userData, email: 'test.user3@email.com' })

    const id = user.body.id

    const session = await request(app).post('/sessions').send({
      email: 'test.user3@email.com',
      password: userData.password,
    })

    const token = session.body.token

    const userResponse = await request(app)
      .delete(`/users/${id}`)
      .auth(token, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(200)
  })

  it('should throw a validation error when sending wrong information to create an user', async () => {
    const userResponse = await request(app).post('/users').send({
      name: 123,
      email: 'test.not.email',
      password: 'password',
    })

    expect(userResponse.statusCode).toBe(400)
    expect(userResponse.body).toHaveProperty('message')
    expect(userResponse.body.message).toBe('Erro de validação')
    expect(userResponse.body).toHaveProperty('issues')
    expect(userResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: expect.arrayContaining(['name']) }),
      ])
    )
    expect(userResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: expect.arrayContaining(['email']) }),
      ])
    )
    expect(userResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: expect.arrayContaining(['password']) }),
      ])
    )
    expect(userResponse.body.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: expect.arrayContaining(['confirmPassword']),
        }),
      ])
    )
  })

  it('should throw an authorization error when trying to access a restricted route without admin credentials', async () => {
    const userResponse = await request(app)
      .post('/users/technician')
      .send({ ...userData })
      .auth(userToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(401)
    expect(userResponse.body).toHaveProperty('message')
    expect(userResponse.body.message).toBe('Não autorizado')
  })

  it('should throw an authorization error when trying to create a non client user without admin credentials', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({ ...userData, email: 'test.user3@email.com', role: 'technician' })

    expect(userResponse.statusCode).toBe(400)
    expect(userResponse.body).toHaveProperty('message')
    expect(userResponse.body.message).toBe(
      'Somente administradores do sistema podem criar usuários com esse papel'
    )
  })

  it('should throw an authorization error when non admin users try to see information about other users', async () => {
    const userResponse = await request(app)
      .get(`/users/${usersId[1]}`)
      .auth(userToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(401)
    expect(userResponse.body).toHaveProperty('message')
    expect(userResponse.body.message).toBe(
      'Você não tem permissão para ver os dados desse usuário'
    )
  })

  it('should throw an error when trying to create an user with the same email as another', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({ ...userData, email: 'test.user2@email.com' })

    expect(userResponse.statusCode).toBe(400)
    expect(userResponse.body).toHaveProperty('message')
    expect(userResponse.body.message).toBe(
      'Já existe um usuário com esse e-mail'
    )
  })

  it('should throw an error when trying to create a technician user without the available hours information', async () => {
    const userResponse = await request(app)
      .post('/users/technician')
      .send({ ...userData, email: 'test.user4@email.com', role: 'technician' })
      .auth(adminToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(400)
    expect(userResponse.body).toHaveProperty('message')
    expect(userResponse.body.message).toBe(
      'Informe os horários disponíveis do técnico'
    )
  })

  it('should throw an error when sending a non existing user as a route param', async () => {
    const userResponse = await request(app)
      .get('/users/f97c3dc8-92d7-452f-a977-0a25a93ca833')
      .auth(adminToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(400)
    expect(userResponse.body).toHaveProperty('message')
    expect(userResponse.body.message).toBe('Usuário não encontrado')
  })

  it('should throw an error when sending no data in an user put request', async () => {
    const userResponse = await request(app)
      .put(`/users/${usersId[0]}`)
      .send({})
      .auth(userToken, { type: 'bearer' })

    expect(userResponse.statusCode).toBe(400)
    expect(userResponse.body).toHaveProperty('message')
    expect(userResponse.body.message).toContain(
      'Informe algum dado a ser atualizado'
    )
  })
})
