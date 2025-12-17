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
        .auth(usersToken[0], { type: 'bearer' })
    }
  })

  it('should send a user image to the backend', async () => {
    const imagePath = path.resolve(__dirname, 'utils', 'user_image_test.png')

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
    expect(fs.existsSync(imagePathOnUploadsFolder)).toBe(false)
  })
})
