import fs from 'node:fs'
import path from 'node:path'

import * as uploadConfigs from '@/configs/upload.js'

class DiskStorage {
  async saveFile(file: string) {
    const tmpPath = path.resolve(uploadConfigs.TMP_FOLDER, file)
    const destPath = path.resolve(uploadConfigs.UPLOADS_FOLDER, file)

    try {
      await fs.promises.access(tmpPath)
    } catch (error) {
      console.log(error)
      throw new Error(`Arquivo não encontrado: ${tmpPath}`)
    }

    await fs.promises.mkdir(uploadConfigs.UPLOADS_FOLDER, { recursive: true })
    await fs.promises.rename(tmpPath, destPath)

    return file
  }

  async deleteFile(file: string, type: 'tmp' | 'upload' = 'tmp') {
    const pathFile =
      type === 'tmp' ? uploadConfigs.TMP_FOLDER : uploadConfigs.UPLOADS_FOLDER

    const filePath = path.resolve(pathFile, file)
    try {
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath)
  }
}

export { DiskStorage }
