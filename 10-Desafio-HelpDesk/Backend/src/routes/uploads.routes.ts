import { Router } from 'express'
import multer from 'multer'

import { UploadsController } from '../controllers/uploads.controller'
import uploadConfig from '../configs/upload'

const upload = multer(uploadConfig.MULTER)

const uploadsRoutes = Router()
const uploadsController = new UploadsController()

uploadsRoutes.post('/', upload.single('file'), uploadsController.create)

export { uploadsRoutes }
