import express from 'express'
import type { Request, Response } from 'express'
import { knex } from './database/knex.js'

const PORT = 3333

const app = express()
app.use(express.json())

app.get('/', async (request: Request, response: Response) => {
  // const courses = await knex.raw('SELECT * FROM courses')
  // const courses = await knex('courses').select().where('id', 1)
  const courses = await knex('courses').select().orderBy('name', 'asc')

  response.json(courses)
})

app.post('/courses', async (request: Request, response: Response) => {
  const { name } = request.body

  await knex('courses').insert({ name })
  // await knex.raw('INSERT INTO courses (name) VALUES (?)', [name])

  response.status(201).json()
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
