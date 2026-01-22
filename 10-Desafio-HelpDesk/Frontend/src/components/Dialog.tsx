// @ts-expect-error TS2307
import CloseIcon from '../assets/icons/close.svg?react'
// @ts-expect-error TS2307
import BackIcon from '../assets/icons/arrow-left.svg?react'
// @ts-expect-error TS2307
import SuccessIcon from '../assets/icons/circle-check-big.svg?react'
// @ts-expect-error TS2307
import FailureIcon from '../assets/icons/circle-alert.svg?react'

import { Button } from '../components/form/Button'
import { useEffect } from 'react'

type Props = React.ComponentProps<'dialog'> & {
  open?: boolean
  title?: string
  action?:
    | 'create'
    | 'edit'
    | 'remove'
    | 'disable'
    | 'enable'
    | 'changePassword'
    | 'success'
    | 'failure'
  handleAction: () => void
  dialogRef: React.RefObject<null | HTMLDialogElement>
  closeDialog: () => void
  backAction?: () => void
  children?: React.ReactNode
  useSamePadding?: boolean
}

export function Dialog({
  open = false,
  title,
  action = 'create',
  handleAction,
  dialogRef,
  closeDialog,
  backAction,
  children,
  useSamePadding = true,
  ...rest
}: Props) {
  let buttonText = ''
  const Wrapper = ['create', 'edit', 'changePassword'].includes(action)
    ? 'form'
    : 'div'

  if (action === 'create' || action === 'edit' || action === 'changePassword')
    buttonText = 'Salvar'
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
      <Wrapper onSubmit={Wrapper === 'form' ? handleAction : undefined}>
        <div className="px-7 pb-5 flex justify-between items-center gap-3">
          {action === 'changePassword' && (
            <BackIcon
              className="w-4.5 h-4.5 text-gray-300 cursor-pointer"
              onClick={backAction}
            />
          )}
          <h1
            className={`font-bold ${action === 'changePassword' && 'flex-1'}`}
          >
            {title}
          </h1>
          <CloseIcon
            className="text-gray-300 w-4.5 h-4.5 cursor-pointer"
            onClick={closeDialog}
          />
        </div>
        <div
          className={`mb-6 py-7 border-y border-gray-500 ${
            useSamePadding && 'px-7'
          }`}
        >
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
                <p>
                  Por favor, corrija sua ação ou tente novamente mais tarde.
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
        <div className="px-7">
          <div className={cancelAction ? `flex gap-2` : undefined}>
            {cancelAction && (
              <Button
                text="Cancelar"
                type="button"
                variant="secondary"
                onClick={closeDialog}
              />
            )}
            <Button
              text={buttonText}
              type={Wrapper === 'div' ? 'button' : 'submit'}
              onClick={Wrapper === 'div' ? handleAction : undefined}
            />
          </div>
        </div>
      </Wrapper>
    </dialog>
  )
}
