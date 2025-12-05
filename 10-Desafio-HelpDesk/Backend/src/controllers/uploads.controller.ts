import { Request, Response } from 'express'
import z, { ZodError } from 'zod'

import { prisma } from '../database/prisma'
import { DiskStorage } from '../providers/disk-storage'
import uploadConfig from '../configs/upload'
import { AppError } from '../utils/app-error'

export class UploadsController {
  async create(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.uuid({ error: 'Informe um usuário válido' }),
    })

    const { id } = paramsSchema.parse(request.params)

    if (
      !request.user ||
      (request.user.id !== id && request.user.role !== 'admin')
    ) {
      throw new AppError(
        'Você não tem permissão para alterar a foto desse usuário',
        401
      )
    }

    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    })

    if (!user) {
      throw new AppError('Usuário não encontrado')
    }

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
      const filename = await diskStorage.saveFile(
        file.filename,
        user.profilePicture
      )

      await prisma.user.update({
        where: { id },
        data: { profilePicture: file.filename },
      })

      return response.json(filename)
    } catch (error) {
      if (request.file) {
        await diskStorage.deleteFile(request.file.filename)
      }

      if (error instanceof ZodError) {
        throw new AppError(error.issues[0].message)
      }

      throw error
    }
  }
}
