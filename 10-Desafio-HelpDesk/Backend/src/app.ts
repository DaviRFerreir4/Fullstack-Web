import 'express-async-errors'
import express from 'express'

import { AppError } from './utils/app-error'
import { errorHandling } from './middlewares/error-handling'

const app = express()

app.use(express.json())

app.get('/', () => {
  throw new AppError('teste')
})

app.use(errorHandling)

export { app }
