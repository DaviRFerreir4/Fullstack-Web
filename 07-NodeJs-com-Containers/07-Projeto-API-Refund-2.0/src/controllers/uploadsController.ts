import { Request, Response } from 'express'
import { z } from 'zod'

import * as uploadConfigs from '@/configs/upload.js'

class UploadsController {
  async create(request: Request, response: Response) {
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

      response.json()
    } catch (error) {
      throw error
    }
  }
}

export { UploadsController }
