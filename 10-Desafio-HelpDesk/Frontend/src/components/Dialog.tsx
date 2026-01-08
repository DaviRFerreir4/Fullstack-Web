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
  action?:
    | 'create'
    | 'edit'
    | 'remove'
    | 'disable'
    | 'enable'
    | 'success'
    | 'failure'
  handleAction: () => void
  dialogRef: RefObject<null | HTMLDialogElement>
  closeDialog: () => void
  children: React.ReactNode
}

export function Dialog({
  open = false,
  title,
  action = 'create',
  handleAction,
  dialogRef,
  closeDialog,
  children,
  ...rest
}: Props) {
  let buttonText = ''

  if (action === 'create' || action === 'edit') buttonText = 'Salvar'
  else if (action === 'enable') buttonText = 'Sim, reativar'
  else if (action === 'disable') buttonText = 'Sim, desativar'
  else if (action === 'remove') buttonText = 'Sim, excluir'
  else if (action === 'failure' || action === 'success') buttonText = 'Fechar'

  const cancelAction =
    action === 'remove' || action === 'enable' || action === 'disable'

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
        <div className={cancelAction ? `flex gap-2` : undefined}>
          {cancelAction && (
            <Button text="Cancelar" variant="secondary" onClick={closeDialog} />
          )}
          <Button text={buttonText} onClick={handleAction} />
        </div>
      </div>
    </dialog>
  )
}
