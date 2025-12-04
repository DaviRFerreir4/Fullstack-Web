import 'express-async-errors'
import express from 'express'

import { prisma } from './database/prisma'

const app = express()

app.use(express.json())

app.get('/', async (req, res) => {
  await prisma.user.create({
    data: {
      name: 'davi',
      email: 'davi@email.com',
      password: '1234',
      role: 'admin',
    },
  })

  const user = await prisma.user.findFirst({ where: { name: 'davi' } })

  return res.json(user)
})

export { app }
