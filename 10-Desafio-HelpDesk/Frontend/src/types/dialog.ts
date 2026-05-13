import type { DialogActions } from './utils'

export type CurrentAction = {
  action: DialogActions
  title: string
  message?: string
  handleAction: (() => void) | ((payload: FormData) => void)
  disableCloseAction?: boolean
} | null
