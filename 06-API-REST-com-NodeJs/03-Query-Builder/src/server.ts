import express from 'express'
import type { Request, Response } from 'express'
import { knex } from './database/knex.js'

const PORT = 3333

const app = express()
app.use(express.json())

app.get('/courses', async (request: Request, response: Response) => {
  // const courses = await knex.raw('SELECT * FROM courses')
  // const courses = await knex('courses').select().where('id', 1)
  const courses = await knex('courses').select().orderBy('name', 'asc')

  return response.json(courses)
})

app.post('/courses', async (request: Request, response: Response) => {
  const { name } = request.body

  await knex('courses').insert({ name })
  // await knex.raw('INSERT INTO courses (name) VALUES (?)', [name])

  return response.status(201).json()
})

app.put('/courses/:id', async (request: Request, response: Response) => {
  const { name } = request.body
  const { id } = request.params

  await knex('courses').update({ name }).where({ id })

  return response.send()
})

app.delete('/courses/:id', async (request: Request, response: Response) => {
  const { id } = request.params

  await knex('courses').delete().where({ id })

  return response.send()
})

// Rotas de módulos

app.get('/modules', async (request: Request, response: Response) => {
  const modules = await knex('course_modules').select().orderBy('name', 'asc')

  return response.json(modules)
})

app.post('/modules', async (request: Request, response: Response) => {
  const { name, course_id } = request.body

  await knex('course_modules').insert({ name, course_id })

  return response.status(201).json()
})

app.delete('/modules/:id', async (request: Request, response: Response) => {
  const { id } = request.params

  await knex('course_modules').delete().where({ id })

  return response.send()
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
