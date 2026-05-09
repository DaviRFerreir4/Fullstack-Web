import type { CreateUserProps } from '../dtos/user'
import { api } from './api'

export function useUserServices() {
  async function createUser({
    name,
    email,
    password,
    confirmPassword,
  }: CreateUserProps) {
    const response = await api.post('/users', {
      name,
      email,
      password,
      confirmPassword,
    })
    return response
  }

  return { createUser }
}
