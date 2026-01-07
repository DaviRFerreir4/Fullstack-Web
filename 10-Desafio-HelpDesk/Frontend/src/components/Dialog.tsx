// @ts-expect-error TS2307
import CloseIcon from '../assets/icons/close.svg?react'

import { Button } from '../components/form/Button'
import { useEffect, type RefObject } from 'react'

type Props = React.ComponentProps<'dialog'> & {
  open?: boolean
  title?: string
  action?: 'save' | 'remove'
  handleAction: () => void
  dialogRef: RefObject<null | HTMLDialogElement>
  closeDialog: () => void
  children: React.ReactNode
}

export function Dialog({
  open = false,
  title,
  action = 'save',
  handleAction,
  dialogRef,
  closeDialog,
  children,
  ...rest
}: Props) {
  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="py-5 rounded-[0.625rem] w-[min(27.5rem,92%)] m-auto backdrop:bg-black/50 backdrop:backdrop-blur-[2px]"
      {...rest}
    >
      <div className="px-7 pb-5 flex justify-between gap-3">
        <h1 className="font-bold">{title}</h1>
        <CloseIcon className="text-gray-300 w-6 h-6" onClick={closeDialog} />
      </div>
      {children}
      {action === 'save' ? (
        <div className="px-7">
          <Button text="Salvar" onClick={handleAction} />
        </div>
      ) : (
        ''
      )}
    </dialog>
  )
}
