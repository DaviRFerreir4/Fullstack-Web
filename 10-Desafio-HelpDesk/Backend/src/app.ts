import 'express-async-errors'
import express from 'express'

import { errorHandling } from './middlewares/error-handling'
import { ensureAuthenticated } from './middlewares/ensure-authenticated'

const app = express()

app.use(express.json())

app.get('/', ensureAuthenticated, (req, res) => {
  return res.send('oi')
})
app.use(errorHandling)

export { app }
