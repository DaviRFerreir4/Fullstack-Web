import { Router } from 'express'
import multer from 'multer'

import { UploadsController } from '@/controllers/uploadsController.js'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js'
import * as uploadConfig from '@/configs/upload.js'

const uploadsRoutes = Router()
const uploadsController = new UploadsController()

const upload = multer(uploadConfig.MULTER)

uploadsRoutes.post(
  '/',
  verifyUserAuthorization(['employee']),
  upload.single('file'),
  uploadsController.create
)

export { uploadsRoutes }
