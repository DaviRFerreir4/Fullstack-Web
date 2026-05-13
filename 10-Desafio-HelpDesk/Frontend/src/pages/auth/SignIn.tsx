import { Input } from '../../components/form/Input'
import { Button } from '../../components/form/Button'
import { useResultDialog } from '../../hooks/useResultDialog'
import { Dialog } from '../../components/dialogs/Dialog'
import { useAuth } from '../../hooks/useAuth'
import { useSignInLogic } from '../../hooks/screens/auth/useSignInLogic'

export function SignIn() {
  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  const auth = useAuth()

  const { state, formAction, isLoading } = useSignInLogic({
    auth,
    setOpenDialog,
    setCurrentAction,
    handleCloseDialog,
  })

  return (
    <div className="w-full">
      <form
        action={!isLoading ? formAction : () => {}}
        className="p-6 border border-gray-500 rounded-[0.625rem] grid gap-8"
      >
        <div>
          <h2 className="text-lg text-gray-200 font-bold">Acesse o portal</h2>
          <p className="text-xs text-gray-300">
            Entre usando seu e-mail e senha cadastrados
          </p>
        </div>
        <div className="grid gap-4">
          <Input
            label="E-mail"
            name="email"
            id="email"
            type="email"
            placeholder="exemplo@mail.com"
            error={!!state?.fieldErrors?.email}
            helperText={
              state?.fieldErrors?.email ? state.fieldErrors.email[0] : undefined
            }
            defaultValue={
              state?.data.email ? state?.data.email?.toString() : undefined
            }
            required
          />
          <Input
            label="Senha"
            name="password"
            id="password"
            type="password"
            placeholder="Digite sua senha"
            helperText={
              state?.fieldErrors?.password
                ? state.fieldErrors.password[0]
                : undefined
            }
            defaultValue={
              state?.data.password
                ? state?.data.password?.toString()
                : undefined
            }
            required
          />
        </div>
        <Button text="Entrar" disabled={isLoading} />
      </form>
      <div className="my-3 p-6 border border-gray-500 rounded-[0.625rem] grid gap-5">
        <div>
          <h3 className="text-gray-200 font-bold">Ainda não tem uma conta?</h3>
          <p className="text-xs text-gray-300">Cadastre agora mesmo</p>
        </div>
        <a
          href="/signup"
          className="block"
          onClick={(event) => isLoading && event.preventDefault()}
        >
          <Button text="Criar conta" variant="secondary" disabled={isLoading} />
        </a>
      </div>
      <Dialog
        open={openDialog}
        dialogRef={dialogRef}
        title={currentAction?.title}
        message={currentAction?.message}
        action={currentAction?.action}
        handleAction={
          currentAction ? currentAction.handleAction : handleCloseDialog
        }
        closeDialog={handleCloseDialog}
        disableCloseAction={currentAction?.disableCloseAction}
      />
    </div>
  )
}
