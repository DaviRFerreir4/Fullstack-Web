import { useRef, useState } from 'react'
import type { DialogActions } from '../types/utils'

export function useResultDialog() {
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const [currentAction, setCurrentAction] = useState<null | {
    action: DialogActions
    title: string
    handleAction: (() => void) | ((payload: FormData) => void)
  }>(null)

  function handleCloseDialog() {
    dialogRef.current?.close()
    setOpenDialog(false)
  }

  return {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  }
}
