import request from 'supertest'
import path from 'node:path'
import fs from 'node:fs'

import { app } from '../app'
import { prisma } from '../database/prisma'
import { userData } from './utils/requestData'
import uploadsConfig from '../configs/upload'

describe('UploadsController', () => {
  let adminToken: string
  const usersToken: string[] = []
  const usersId: string[] = []
  const imagePath = path.resolve(__dirname, 'utils', 'user_image_test.png')
  let imagePathOnUploadsFolder: string

  beforeAll(async () => {
    const adminResponse = await request(app)
      .post('/sessions')
      .send({ email: 'davi@email.com', password: 'Drowssap1.' })

    adminToken = adminResponse.body.token

    const userResponse = await request(app)
      .post('/users')
      .send({ ...userData })

    usersId.push(userResponse.body.id)

    const sessionResponse = await request(app)
      .post('/sessions')
      .send({ email: userData.email, password: userData.password })

    usersToken.push(sessionResponse.body.token)
  })

  afterAll(async () => {
    for (const id of usersId) {
      await request(app)
        .delete(`/users/${id}`)
        .auth(adminToken, { type: 'bearer' })
    }
  })

  it('should send a user image to the backend', async () => {
    const uploadResponse = await request(app)
      .post(`/uploads/${usersId[0]}`)
      .attach('file', imagePath)
      .auth(usersToken[0], { type: 'bearer' })

    imagePathOnUploadsFolder = path.resolve(
      uploadsConfig.UPLOADS_FOLDER,
      uploadResponse.body
    )

    expect(uploadResponse.statusCode).toBe(201)
    expect(uploadResponse.body).toContain(usersId[0])
    expect(fs.existsSync(imagePathOnUploadsFolder)).toBe(true)

    const user = await prisma.user.findUnique({ where: { id: usersId[0] } })

    expect(user).toBeTruthy()
    expect(user?.profilePicture).toBe(uploadResponse.body)
  })

  it('should return the requested user image', async () => {
    const user = await prisma.user.findUnique({ where: { id: usersId[0] } })

    expect(user).toBeTruthy()

    const uploadResponse = await request(app)
      .get(`/uploads/${user?.profilePicture}`)
      .auth(usersToken[0], { type: 'bearer' })

    expect(uploadResponse.statusCode).toBe(200)
    expect(uploadResponse.headers).toHaveProperty('content-type', 'image/png')
  })

  it('should delete the image when deleting the user', async () => {
    const userResponse = await request(app)
      .delete(`/users/${usersId[0]}`)
      .auth(usersToken[0], { type: 'bearer' })

    expect(userResponse.statusCode).toBe(200)

    usersId.pop()
    usersToken.pop()

    expect(fs.existsSync(imagePathOnUploadsFolder)).toBe(false)
  })

  it('should throw an authentication error when trying to send a image without credentials', async () => {
    const uploadResponse = await request(app).post(
      `/uploads/dbf57204-15be-4c3f-9eb7-7edca15aba87`
    )

    // Testando sem .attach porque o supertest começa a stream do arquivo assim que a requisição é feita, e lançar um erro durante esse processo gerar um erro 'read ECONNRESET'

    expect(uploadResponse.statusCode).toBe(400)
    expect(uploadResponse.body).toHaveProperty('message')
    expect(uploadResponse.body.message).toBe('JWT não encontrado')
  })

  it('should throw an authorization error when trying to change an image from another user', async () => {
    const users = [
      {
        ...userData,
      },
      {
        ...userData,
        email: 'test.user2@email.com',
      },
    ]

    for (const user of users) {
      const userResponse = await request(app)
        .post('/users')
        .send({ ...user })

      expect(userResponse.statusCode).toBe(201)
      expect(userResponse.body).toHaveProperty('id')

      usersId.push(userResponse.body.id)

      const sessionResponse = await request(app)
        .post('/sessions')
        .send({ email: user.email, password: user.password })

      expect(sessionResponse.statusCode).toBe(201)
      expect(sessionResponse.body).toHaveProperty('token')

      usersToken.push(sessionResponse.body.token)
    }

    const uploadResponse = await request(app)
      .post(`/uploads/${usersId[0]}`)
      .attach('file', imagePath)
      .auth(usersToken[1], { type: 'bearer' })

    expect(uploadResponse.statusCode).toBe(401)
    expect(uploadResponse.body).toHaveProperty('message')
    expect(uploadResponse.body.message).toBe(
      'Você não tem permissão para alterar a foto desse usuário'
    )
  })

  it('should throw a validation error based on the type of the file sent', async () => {
    const uploadResponse = await request(app)
      .post(`/uploads/${usersId[0]}`)
      .attach('file', path.resolve(__dirname, 'utils', 'not_an_user_image.txt'))
      .auth(usersToken[0], { type: 'bearer' })

    expect(uploadResponse.statusCode).toBe(400)
    expect(uploadResponse.body).toHaveProperty('message')
    expect(uploadResponse.body.message).toContain(
      'Formato de arquivo inválido.'
    )
  })

  it('should throw an error when sending a non existing user as a route param', async () => {
    const uploadResponse = await request(app)
      .post(`/uploads/51d01930-62d3-4039-95e9-b4d1633e3b21`)
      .attach('file', imagePath)
      .auth(adminToken, { type: 'bearer' })

    expect(uploadResponse.statusCode).toBe(400)
    expect(uploadResponse.body).toHaveProperty('message')
    expect(uploadResponse.body.message).toContain('Usuário não encontrado')
  })
})
