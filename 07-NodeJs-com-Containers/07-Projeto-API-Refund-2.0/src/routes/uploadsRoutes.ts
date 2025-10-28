import express, { Router } from 'express'
import multer from 'multer'

import { UploadsController } from '@/controllers/uploadsController.js'
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization.js'
import * as uploadConfigs from '@/configs/upload.js'

const uploadsRoutes = Router()
const uploadsController = new UploadsController()

const upload = multer(uploadConfigs.MULTER)

// GET
uploadsRoutes.use(
  '/',
  verifyUserAuthorization(['manager']),
  express.static(uploadConfigs.UPLOADS_FOLDER)
)

uploadsRoutes.post(
  '/',
  verifyUserAuthorization(['employee']),
  upload.single('file'),
  uploadsController.create
)

uploadsRoutes.delete(
  '/:filename',
  verifyUserAuthorization(['manager']),
  uploadsController.remove
)

export { uploadsRoutes }
