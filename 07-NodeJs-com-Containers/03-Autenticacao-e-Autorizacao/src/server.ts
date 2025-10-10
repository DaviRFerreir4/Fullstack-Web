import express from 'express'
import type { Request, Response } from 'express'
import 'express-async-errors'
import { routes } from './routes/index.js'

const PORT = 3333

const app = express()

app.use(express.json())

app.use(routes)

app.use((error: any, request: Request, response: Response) => {
  return response.status(500).json({ message: error.message })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
