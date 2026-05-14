import multer from 'multer'
import path from 'node:path'
import z from 'zod'

const TMP_FOLDER = path.resolve(__dirname, '..', 'tmp')
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, '..', 'uploads')

const MAX_SIZE = 3
const MAX_FILE_SIZE = 1024 * 1024 * MAX_SIZE // calculo de MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png']

const paramsSchema = z.object({
  id: z.uuid({ error: 'teste' }),
})

const MULTER = {
  storage: multer.diskStorage({
    destination: TMP_FOLDER,
    filename(request, file, callback) {
      try {
        const { id } = paramsSchema.parse(request.params)

        const fileName = `${id}-${file.originalname}`

        callback(null, fileName)
      } catch (error: any) {
        callback(error, file.filename)
      }
    },
  }),
}

export default {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
  MAX_FILE_SIZE,
  MAX_SIZE,
  ACCEPTED_IMAGE_TYPES,
}
