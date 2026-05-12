import type { PaginationType } from '../types/utils'
import type { Service } from './services'
import type { User } from './user'

export type Status = 'opened' | 'in_progress' | 'closed'

export interface UserRequest {
  id: number
  title: string
  description: string
  status: Status
  createdAt: string
  updatedAt: string
  technician?: Pick<User, 'id' | 'name' | 'email' | 'profilePicture'>
  client?: Pick<User, 'id' | 'name' | 'email' | 'profilePicture'>
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

export interface IndexRequestAPIResponse {
  requests: UserRequest[]
  pagination: PaginationType
}

export type ShowRequestAPIResponse = UserRequest

export type CreateRequestBody = Pick<UserRequest, 'title' | 'description'> & {
  serviceId: string
  assignedTo?: string
}

export type CreateRequestAPIResponse = UserRequest

export interface CreateRequestServiceBody {
  serviceId: string
}

export type CreateRequestServiceAPIResponse = UserRequest

export type DeleteRequestServiceBody = CreateRequestServiceBody

export type DeleteRequestServiceAPIResponse = UserRequest

export type PatchRequestStatusBody = Pick<UserRequest, 'status'>

export type PatchRequestStatusAPIResponse = UserRequest
