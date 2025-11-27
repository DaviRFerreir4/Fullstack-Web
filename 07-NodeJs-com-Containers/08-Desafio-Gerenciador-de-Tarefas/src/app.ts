import express from 'express'
import 'express-async-errors'
import { prisma } from './database/prisma'
import { errorHandling } from './middlewares/error-handling'
import { AppError } from '../utils/app-error'

const app = express()

app.use(errorHandling)

export { app }
