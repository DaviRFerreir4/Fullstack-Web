type TUserRole = 'admin' | 'member'

declare namespace Express {
  interface Request {
    user?: {
      id: string
      role: TUserRole
    }
  }
}
