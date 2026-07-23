import { useState } from 'react'
import { api } from '../../services/api'

const cache: Record<string, Promise<string> | undefined> = {}

export async function clearProfilePicturesCache(id?: string) {
  if (id) {
    if (cache[id]) {
      try {
        const cachedURL = await cache[id]
        URL.revokeObjectURL(cachedURL)
      } catch (e) {
      } finally {
        delete cache[id]
      }
    }

    return
  }

  for (const key in cache) {
    const promise = cache[key]

    if (promise) {
      try {
        const cachedURL = await promise
        URL.revokeObjectURL(cachedURL)
      } catch (e) {
      } finally {
        delete cache[key]
      }
    }
  }
}

export function useProfilePictureLogic() {
  const [imageURL, setImageURL] = useState('')

  async function fetchImage({
    userId,
    profilePicture,
  }: {
    userId?: string
    profilePicture?: string
  }) {
    if (!profilePicture || !userId) return
    if (cache[userId]) {
      try {
        const cachedURL = await cache[userId]
        setImageURL(cachedURL)
        return
      } catch (error) {
        delete cache[profilePicture]
        return
      }
    }

    const promise = (async () => {
      const response = await api.get(`/uploads/${profilePicture}`, {
        responseType: 'blob',
      })
      const imageBlob = response.data
      return URL.createObjectURL(imageBlob)
    })()

    cache[userId] = promise

    try {
      const generatedImageURL = await promise
      setImageURL(generatedImageURL)
    } catch (error) {
      delete cache[userId]
      return
    }
  }

  return { imageURL, fetchImage }
}
