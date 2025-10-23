type TRole = 'employee' | 'manager'

declare namespace Express {
  export interface Request {
    user?: {
      id: string
      role: TRole
    }
  }
}
