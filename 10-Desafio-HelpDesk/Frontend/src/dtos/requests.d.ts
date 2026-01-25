interface UserRequest {
  id: number
  title: string
  description: string
  status: 'opened' | 'in_progress' | 'closed'
  requestedBy: string
  assignedTo: string
  createdAt: string
  updatedAt: string
  technician?: Omit<User, 'password'>
  client?: Omit<User, 'password'>
  services: {
    createdAt: string
    service: Service
  }[]
}

interface IndexRequestByUserAPIResponse {
  requests: UserRequest[]
  pagination: Pagination
}
