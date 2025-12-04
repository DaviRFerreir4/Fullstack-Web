import 'express-async-errors'
import express from 'express'

import { errorHandling } from './middlewares/error-handling'
import { ensureAuthenticated } from './middlewares/ensure-authenticated'
import { verifyUserAuthorization } from './middlewares/verify-user-authorization'

const app = express()

app.use(express.json())

app.get(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['client']),
  (req, res) => {
    return res.send('oi')
  }
)
app.use(errorHandling)

export { app }
