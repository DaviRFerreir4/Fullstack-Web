import { api } from './api'

export function useUploadServices() {
  async function createUpload({ id, body }: { id: string; body: File }) {
    const formData = new FormData()

    formData.append('file', body)

    const response = await api.post<string>(`/uploads/${id}`, formData)

    return response
  }

  async function deleteUpload({ id }: { id: string }) {
    const response = await api.delete(`/uploads/${id}`)

    return response
  }

  return { createUpload, deleteUpload }
}
