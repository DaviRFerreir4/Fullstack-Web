import type {
  IndexUserAPIResponse,
  IndexUserQuery,
  CreateUserAPIResponse,
  CreateUserBody,
  ShowUserAPIResponse,
  PutUserBody,
  PutUserAPIResponse,
  DeleteUserAPIResponse,
} from '../dtos/user'
import { api } from './api'

export function useUserServices() {
  async function indexUsers({ query }: { query: IndexUserQuery }) {
    const { name, role, page, perPage } = query

    const response = await api.get<IndexUserAPIResponse>('/users', {
      params: { name, role, page, perPage },
    })

    return response
  }

  async function showUser({ id }: { id: string }) {
    const response = await api.get<ShowUserAPIResponse>(`/users/${id}`)

    return response
  }

  async function createUser({
    body,
    endpoint,
  }: {
    body: CreateUserBody
    endpoint: string
  }) {
    const { name, email, password, confirmPassword, role, available_hours } =
      body

    const response = await api.post<CreateUserAPIResponse>(endpoint, {
      name,
      email,
      password,
      confirmPassword,
      role,
      available_hours,
    })

    return response
  }

  async function putUser({ id, body }: { id: string; body: PutUserBody }) {
    const { name, email, password, confirmPassword, availableHours } = body

    const response = await api.put<PutUserAPIResponse>(`/users/${id}`, {
      name,
      email,
      password,
      confirmPassword,
      availableHours,
    })

    return response
  }

  async function deleteUser({ id }: { id: string }) {
    const response = await api.delete<DeleteUserAPIResponse>(`/users/${id}`)

    return response
  }

  return { indexUsers, showUser, createUser, putUser, deleteUser }
}
