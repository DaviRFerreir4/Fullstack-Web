import type { PaginationType } from '../types/utils'

export interface Service {
  id: string
  title: string
  value: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IndexServiceQuery {
  title?: string
  is_active?: boolean
  gt?: number
  lt?: number
  idsToIgnore?: string[]
  page?: number
  perPage?: number
}

export interface IndexServiceAPIResponse {
  services: Service[]
  pagination: PaginationType
}

export type CreateServiceBody = Pick<Service, 'title' | 'value'>

export type CreateServiceAPIResponse = Service

export type PutServiceBody = Pick<Service, 'title' | 'value'>

export type PutServiceAPIResponse = Service

export type PatchServiceIsActiveBody = Pick<Service, 'isActive'>

export type PatchServiceIsActiveAPIResponse = Service
