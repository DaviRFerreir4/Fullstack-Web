// import { UserRole } from '@prisma/client'
type IUserRole = 'admin' | 'member'

declare namespace Express {
  interface Request {
    user?: {
      id: string
      role: IUserRole
    }
  }
}
