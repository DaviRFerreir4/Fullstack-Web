import { Request, Response } from 'express'
import z, { ZodError } from 'zod'

import uploadConfig from '../configs/upload'
import { DiskStorage } from '../providers/disk-storage'
import { AppError } from '../utils/app-error'

export class UploadsController {
  async create(request: Request, response: Response) {
    const diskStorage = new DiskStorage()

    try {
      const fileSchema = z.looseObject({
        filename: z.string({ error: 'Arquivo é obrigatório' }).min(1),
        mimetype: z
          .string()
          .refine((type) => uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type), {
            error: `Formato de arquivo inválido. Formatos permitidos: ${uploadConfig.ACCEPTED_IMAGE_TYPES.join(
              ', '
            )}`,
          }),
        size: z
          .number()
          .positive()
          .refine((size) => size <= uploadConfig.MAX_FILE_SIZE, {
            error: `Arquivo excede o tamanho máximo de ${uploadConfig.MAX_SIZE} MBs`,
          }),
      })

      const file = fileSchema.parse(request.file)
      const filename = await diskStorage.saveFile(file.filename)

      return response.json(filename)
    } catch (error) {
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file.filename)
        }

        throw new AppError(error.issues[0].message)
      }

      throw error
    }
  }
}
