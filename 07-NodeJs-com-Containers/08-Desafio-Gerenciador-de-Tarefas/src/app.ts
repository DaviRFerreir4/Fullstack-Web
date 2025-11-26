import express from 'express'
import 'express-async-errors'
import { prisma } from './database/prisma'

const app = express()

export { app }
