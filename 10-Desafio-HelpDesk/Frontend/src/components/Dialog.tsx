// @ts-expect-error TS2307
import CloseIcon from '../assets/icons/close.svg?react'
// @ts-expect-error TS2307
import SuccessIcon from '../assets/icons/circle-check-big.svg?react'
// @ts-expect-error TS2307
import FailureIcon from '../assets/icons/circle-alert.svg?react'

import { Button } from '../components/form/Button'
import { useEffect, type RefObject } from 'react'

type Props = React.ComponentProps<'dialog'> & {
  open?: boolean
  title?: string
  action?: 'save' | 'remove' | 'disable' | 'success' | 'failure'
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
        <CloseIcon
          className="text-gray-300 w-6 h-6 cursor-pointer"
          onClick={closeDialog}
        />
      </div>
      <div className="px-7 mb-6 py-7 border-y border-gray-500">
        {action === 'success' ? (
          <div className="grid justify-center justify-items-center gap-4">
            <SuccessIcon className="w-12 h-12 text-feedback-done/70" />
            <span>Ação realizada com sucesso!</span>
          </div>
        ) : action === 'failure' ? (
          <div className="grid justify-center justify-items-center gap-4">
            <FailureIcon className="w-12 h-12 text-feedback-danger/70" />
            <div>
              <p className="mb-1">Erro ao realizar a ação requisitada.</p>
              <p>Por favor, tente novamente mais tarde.</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
      <div className="px-7">
        {action === 'save' ? (
          <Button text="Salvar" onClick={handleAction} />
        ) : action === 'remove' ? (
          <div className="flex gap-2">
            <Button text="Cancelar" variant="secondary" onClick={closeDialog} />
            <Button text="Sim, excluir" onClick={handleAction} />
          </div>
        ) : action === 'success' || action === 'failure' ? (
          <Button text="Fechar" onClick={closeDialog} />
        ) : (
          ''
        )}
      </div>
    </dialog>
  )
}
