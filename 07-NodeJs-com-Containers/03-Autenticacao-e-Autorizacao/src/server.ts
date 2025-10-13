import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import { AppError } from './utils/AppError.js'
import { routes } from './routes/index.js'

const PORT = 3333

const app = express()

app.use(express.json())

app.use(routes)

app.use((error: any, request: Request, response: Response, _: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  return response.status(500).json({ message: error.message })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
