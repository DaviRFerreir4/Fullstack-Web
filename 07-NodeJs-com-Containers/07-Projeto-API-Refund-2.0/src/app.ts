import express from 'express'
import cors from 'cors'

import { errorHandling } from './middlewares/errorHandling.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use(errorHandling)

export { app }
