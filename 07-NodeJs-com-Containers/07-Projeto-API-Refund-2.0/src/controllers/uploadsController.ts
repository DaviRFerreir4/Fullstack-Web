import { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

import * as uploadConfigs from '@/configs/upload.js'
import { DiskStorage } from '@/providers/diskStorage.js'
import { AppError } from '@/utils/AppError.js'

class UploadsController {
  async create(request: Request, response: Response) {
    const diskStorage = new DiskStorage()

    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, { message: 'Arquivo é obrigatório' }),
          mimetype: z
            .string()
            .refine(
              (type) => uploadConfigs.ACCEPTED_IMAGE_TYPES.includes(type),
              {
                message: `Formato de arquivo inválido. Formatos permitidos: ${uploadConfigs.ACCEPTED_IMAGE_TYPES}`,
              }
            ),
          size: z
            .number()
            .positive()
            .refine((size) => size <= uploadConfigs.MAX_FILE_SIZE, {
              message: `Arquivo excede o tamanho máximo de ${uploadConfigs.MAX_SIZE}MBs`,
            }),
        })
        .passthrough()

      const file = fileSchema.parse(request.file)
      const filename = await diskStorage.saveFile(file.filename)

      response.json({ filename })
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

  async remove(request: Request, response: Response, next: NextFunction) {
    const diskStorage = new DiskStorage()

    try {
      const fileNameSchema = z
        .string()
        .min(1, { message: 'Arquivo é obrigatório' })

      const filename = fileNameSchema.parse(request.params?.filename)

      await diskStorage.deleteFile(filename, 'upload')

      return response.json({ filename })
    } catch (error) {
      next(error)
    }
  }
}

export { UploadsController }
