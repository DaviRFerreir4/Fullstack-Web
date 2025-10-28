import express from 'express'
import 'express-async-errors'
import cors from 'cors'

import { errorHandling } from './middlewares/errorHandling.js'
import { routes } from './routes/index.js'
import * as uploadConfigs from './configs/upload.js'

const app = express()

app.use(cors())
app.use(express.json())

// GET
app.use('/uploads', express.static(uploadConfigs.UPLOADS_FOLDER))

app.use(routes)

app.use(errorHandling)

export { app }
