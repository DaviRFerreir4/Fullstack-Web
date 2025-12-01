import request from 'supertest'

import { app } from '../app'
import { prisma } from '../database/prisma'
import { response } from 'express'

describe('TasksController', () => {
  let token: string
  let taskId: string
  let taskHistoryId: string
  let userId: string
  let teamId: string
  let teamMemberRegisterId: string

  const taskData = {
    title: 'Test Task',
    description: 'Task used to test the /tasks endpoint on the API',
    assign_to: '',
    team_id: '',
  }

  const teamData = {
    name: 'Test Team',
    description: 'Team used to test the /teams endpoint on the API',
  }

  const userData = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: '12345678',
  }

  beforeAll(async () => {
    const sessionResponse = await request(app).post('/sessions').send({
      email: 'davi@email.com',
      password: '12345678',
    })

    token = sessionResponse.body.token

    const user = await prisma.user.create({ data: { ...userData } })
    userId = user.id
    taskData.assign_to = userId

    const team = await prisma.team.create({ data: { ...teamData } })
    teamId = team.id
    taskData.team_id = teamId

    const teamMemberRegister = await prisma.teamsMembers.create({
      data: { teamId, userId },
    })
    teamMemberRegisterId = teamMemberRegister.id
  })

  afterAll(async () => {
    await prisma.teamsMembers.delete({ where: { id: teamMemberRegisterId } })
    await prisma.tasksHistory.delete({ where: { id: taskHistoryId } })
    await prisma.task.delete({ where: { id: taskId } })
    await prisma.user.delete({ where: { id: userId } })
    await prisma.team.delete({ where: { id: teamId } })
  })

  it('should create a new task', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({
        ...taskData,
      })
      .auth(token, { type: 'bearer' })

    const task = await prisma.task.findFirst({
      where: { title: taskData.title },
    })

    if (!task) {
      return
    }

    taskId = task.id

    expect(response.statusCode).toBe(201)
  })

  it('should list all tasks', async () => {
    const response = await request(app)
      .get('/tasks')
      .auth(token, { type: 'bearer' })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: taskData.title }),
      ])
    )
  })

  it('should update data from a task', async () => {
    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .send({
        description: 'Some other description',
      })
      .auth(token, { type: 'bearer' })

    expect(response.statusCode).toBe(200)
  })

  it('should update the task status and generate a task history', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskId}`)
      .send({
        status: 'in_progress',
      })
      .auth(token, { type: 'bearer' })

    const taskHistory = await prisma.tasksHistory.findFirst({
      where: { taskId },
    })

    if (!taskHistory) {
      return
    }

    taskHistoryId = taskHistory.id

    expect(response.statusCode).toBe(200)
    expect(taskHistory.oldStatus).toBe('pending')
    expect(taskHistory.taskId).toBe(taskId)
  })
})
