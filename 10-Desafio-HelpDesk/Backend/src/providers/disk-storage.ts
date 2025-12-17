import fs from 'node:fs'
import path from 'node:path'

import uploadConfig from '../configs/upload'
import { AppError } from '../utils/app-error'

export class DiskStorage {
  async saveFile(file: string, profilePicture: string | null) {
    const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file)
    const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)

    try {
      await fs.promises.access(tmpPath)
    } catch (error) {
      throw new AppError(`Arquivo não encontrado: ${tmpPath}`)
    }

    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true })
    await fs.promises.rename(tmpPath, destPath)

    if (profilePicture && profilePicture !== file) {
      await this.deleteFile(profilePicture, 'uploads')
    }

    return file
  }

  async deleteFile(file: string, type: 'tmp' | 'uploads' = 'tmp') {
    const pathFile =
      type === 'tmp' ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER

    const filePath = path.resolve(pathFile, file)

    try {
      await fs.promises.stat(filePath)
    } catch (error) {
      console.log(error)
      return
    }

    await fs.promises.unlink(filePath)
  }
}
