import type { PaginationType } from '../types/utils'

export type UserAPIRole = 'client' | 'technician' | 'admin'

export interface User {
  id: string
  name: string
  email: string
  password: string
  profilePicture?: string
  role: UserAPIRole
  createdAt: string
  updatedAt: string
}

export type UserWithoutPassword = Omit<User, 'password'>

export type CreateSessionBody = Pick<User, 'email' | 'password'>

export interface CreateSessionAPIResponse {
  token: string
  user: Pick<User, 'id' | 'name' | 'role'>
}

export interface IndexUserQuery {
  name?: string
  role?: UserAPIRole
  page?: number
  perPage?: number
}

export interface IndexUserAPIResponse {
  users: (UserWithoutPassword & {
    _count: { clientRequest: number; technicianRequest: number }
  })[]
  pagination: PaginationType
}

export type ShowUserAPIResponse = UserWithoutPassword

export type CreateUserBody = Pick<User, 'name' | 'email' | 'password'> &
  Partial<Pick<User, 'role'>> & {
    confirmPassword: string
    available_hours?: number[]
  }

export type CreateUserAPIResponse = UserWithoutPassword

export type PutUserBody = Partial<CreateUserBody> & {
  availableHours?: number[]
}

export type PutUserAPIResponse = UserWithoutPassword

export type DeleteUserAPIResponse = UserWithoutPassword
