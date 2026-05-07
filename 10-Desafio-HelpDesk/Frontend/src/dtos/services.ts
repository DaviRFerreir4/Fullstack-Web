import type { TPagination } from '../types/utils'

export interface Service {
  id: string
  title: string
  value: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface IndexServiceAPIResponse {
  services: Service[]
  pagination: TPagination
}
