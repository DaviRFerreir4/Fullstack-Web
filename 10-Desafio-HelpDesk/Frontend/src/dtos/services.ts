import type { TPagination } from '../types/utils'

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
  pagination: TPagination
}
