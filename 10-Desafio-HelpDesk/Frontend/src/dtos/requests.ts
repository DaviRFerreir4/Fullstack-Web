import type { TPagination } from '../types/utils'
import type { Service } from './services'
import type { User } from './user'

export type Status = 'opened' | 'in_progress' | 'closed'

export interface UserRequest {
  id: number
  title: string
  description: string
  status: Status
  requestedBy: string
  assignedTo: string
  createdAt: string
  updatedAt: string
  technician?: Omit<User, 'password'>
  client?: Omit<User, 'password'>
  services: {
    createdAt: string
    service: Omit<Service, 'createdAt' | 'updatedAt'>
  }[]
}

export interface IndexRequestsQuery {
  status?: Status
  perPage?: number
  page?: number
}

export interface IndexRequestByUserAPIResponse {
  requests: UserRequest[]
  pagination: TPagination
}
