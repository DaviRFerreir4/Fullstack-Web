import type { SessionAPIResponse } from '../dtos/user'
import { api } from './api'

interface CreateSessionProps {
  email: string
  password: string
}

export function useSessionServices() {
  async function createSession({ email, password }: CreateSessionProps) {
    const response = await api.post<SessionAPIResponse>('/sessions', {
      email,
      password,
    })
    return response
  }

  return { createSession }
}
