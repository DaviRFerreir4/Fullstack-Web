export type DialogActions =
  | 'create'
  | 'edit'
  | 'remove'
  | 'disable'
  | 'enable'
  | 'changePassword'
  | 'success'
  | 'failure'

export interface TPagination {
  page: number
  perPage: number
  totalPages: number
  totalRecords: number
}
