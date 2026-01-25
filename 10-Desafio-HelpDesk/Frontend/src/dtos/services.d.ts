interface Service {
  id: string
  title: string
  value: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface IndexServiceAPIResponse {
  services: Service[]
  pagination: Pagination
}
