type DialogActions =
  | 'create'
  | 'edit'
  | 'remove'
  | 'disable'
  | 'enable'
  | 'changePassword'
  | 'success'
  | 'failure'

interface SignUpFormErrors {
  name?: string[]
  email?: string[]
  password?: string[]
  confirmPassword?: string[]
}

interface SignInFormErrors {
  email?: string[]
  password?: string[]
}

interface CreateRequestFormErrors {
  title?: string[]
  description?: string[]
  serviceId?: string[]
}

interface Pagination {
  page: number
  perPage: number
  totalPages: number
  totalRecords: number
}
