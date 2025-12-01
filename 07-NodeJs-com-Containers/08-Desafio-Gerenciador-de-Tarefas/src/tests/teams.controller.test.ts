import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'

describe('TeamsController', () => {
  let token: string

  const teamData = {
    name: 'Test Team',
    description: 'Team used to test the /teams endpoint on the API',
  }

  beforeAll(async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: '12345678',
    })

    token = sessionResponse.body.token
  })

  afterAll(async () => {
    const team = await prisma.team.findFirst({ where: { name: teamData.name } })

    if (!team) {
      return
    }

    await prisma.team.delete({ where: { id: team.id } })
  })

  it('should create a new team successfully', async () => {
    const response = await request(app)
      .post('/teams')
      .send({
        ...teamData,
      })
      .auth(token, { type: 'bearer' })

    expect(response.statusCode).toBe(201)
  })

  it('should show all teams registred', async () => {
    const response = await request(app)
      .get('/teams')
      .auth(token, { type: 'bearer' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ ...teamData })])
    )
  })
})
