export type DialogActions =
  | 'create'
  | 'edit'
  | 'remove'
  | 'disable'
  | 'enable'
  | 'changePassword'
  | 'success'
  | 'failure'

export interface PaginationType {
  page: number
  perPage: number
  totalPages: number
  totalRecords: number
}
