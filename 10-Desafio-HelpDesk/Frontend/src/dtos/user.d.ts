type UserAPIRole = 'client' | 'technician' | 'admin'

interface SessionAPIResponse {
  token: string
  user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'profilePicture'>
}

interface User {
  id: string
  name: string
  email: string
  password: string
  profilePicture?: string
  role: UserAPIRole
  createdAt: string
  updatedAt: string
}
