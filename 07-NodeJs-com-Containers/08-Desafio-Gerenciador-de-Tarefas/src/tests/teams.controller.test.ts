import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'

describe('TeamsController', () => {
  let token: string

  const teamData = {
    name: 'Test Team',
    description: 'Team used to test the /teams endpoint on the API',
  }

  const userData = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: '12345678',
    confirm_password: '12345678',
  }

  beforeAll(async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: '12345678',
    })

    token = sessionResponse.body.token
  })

  afterAll(async () => {
    const user = await prisma.user.findFirst({
      where: { email: userData.email },
    })

    const team = await prisma.team.findFirst({ where: { name: teamData.name } })

    if (!user) {
      return
    }

    if (!team) {
      return
    }

    const teamMemberRegister = await prisma.teamsMembers.findFirst({
      where: { teamId: team.id, userId: user.id },
    })

    if (!teamMemberRegister) {
      return
    }

    await prisma.teamsMembers.delete({ where: { id: teamMemberRegister.id } })
    await prisma.user.delete({ where: { id: user.id } })
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

  it("should show a team and it's members", async () => {
    await request(app)
      .post('/users')
      .send({
        ...userData,
      })
      .auth(token, { type: 'bearer' })

    const user = await prisma.user.findFirst({
      where: { email: userData.email },
    })
    const team = await prisma.team.findFirst({ where: { name: teamData.name } })

    if (!user || !team) {
      return
    }

    await request(app)
      .post('/teams-members')
      .send({
        user_id: user.id,
        team_id: team.id,
      })
      .auth(token, { type: 'bearer' })

    const response = await request(app)
      .get(`/teams/${team.id}/members`)
      .auth(token, { type: 'bearer' })

    const memberSchema = {
      member: expect.arrayContaining([
        expect.objectContaining({
          user: expect.objectContaining({ name: userData.name }),
        }),
      ]),
    }

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining(memberSchema)])
    )
  })
})
