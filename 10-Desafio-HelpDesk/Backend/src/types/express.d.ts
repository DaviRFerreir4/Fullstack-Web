type Role = 'admin' | 'technician' | 'client'

declare namespace Express {
  interface Request {
    user?: {
      id: string
      role: Role
    }
  }
}
