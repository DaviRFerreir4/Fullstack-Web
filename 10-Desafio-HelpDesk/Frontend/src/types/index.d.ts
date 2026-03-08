type DialogActions =
  | 'create'
  | 'edit'
  | 'remove'
  | 'disable'
  | 'enable'
  | 'changePassword'
  | 'success'
  | 'failure'

interface Pagination {
  page: number
  perPage: number
  totalPages: number
  totalRecords: number
}
