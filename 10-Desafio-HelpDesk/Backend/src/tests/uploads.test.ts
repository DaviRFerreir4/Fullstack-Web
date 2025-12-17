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

    expect(uploadResponse.statusCode).toBe(200)
    expect(uploadResponse.body).toContain(usersId[0])
    expect(
      fs.existsSync(
        path.resolve(uploadsConfig.UPLOADS_FOLDER, uploadResponse.body)
      )
    ).toBe(true)
  })
})
