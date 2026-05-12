import type { CreateSessionAPIResponse, CreateSessionBody } from '../dtos/user'
import { api } from './api'

export function useSessionServices() {
  async function createSession({ body }: { body: CreateSessionBody }) {
    const { email, password } = body

    const response = await api.post<CreateSessionAPIResponse>('/sessions', {
      email,
      password,
    })

    return response
  }

  return { createSession }
}
