import { Router } from 'express'

import { RefundsController } from '@/controllers/refundsController.js'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js'

const refundsRoutes = Router()
const refundsController = new RefundsController()

refundsRoutes.get(
  '/',
  verifyUserAuthorization(['manager']),
  refundsController.index
)

refundsRoutes.post(
  '/',
  verifyUserAuthorization(['employee']),
  refundsController.create
)

export { refundsRoutes }
