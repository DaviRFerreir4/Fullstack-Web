import { Input } from '../../components/form/Input'
import { Button } from '../../components/form/Button'
import { Dialog } from '../../components/Dialog'
import { useResultDialog } from '../../hooks/useResultDialog'
import { useSignUpLogic } from '../../hooks/screens/auth/useSignUpLogic'

export function SignUp() {
  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  const { state, formAction, isLoading } = useSignUpLogic({
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
          <h2 className="text-lg text-gray-200 font-bold">Crie sua conta</h2>
          <p className="text-xs text-gray-300">
            Informe seu nome, e-mail e senha
          </p>
        </div>
        <div className="grid gap-4">
          <Input
            label="Nome"
            name="name"
            id="name"
            placeholder="Digite o nome completo"
            error={!!state?.fieldErrors?.name}
            helperText={
              state?.fieldErrors?.name ? state.fieldErrors.name[0] : undefined
            }
            defaultValue={
              state?.data.name ? state?.data.name?.toString() : undefined
            }
            required
          />
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
            error={!!state?.fieldErrors?.password}
            helperText={
              state?.fieldErrors?.password
                ? state.fieldErrors.password[0]
                : 'Mínimo de 8 dígitos'
            }
            defaultValue={
              state?.data.password
                ? state?.data.password?.toString()
                : undefined
            }
            required
          />
          <Input
            label="Confirmação da senha"
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            error={!!state?.fieldErrors?.confirmPassword || !!state?.formErrors}
            helperText={
              state?.fieldErrors?.confirmPassword
                ? state.fieldErrors.confirmPassword[0]
                : !!state?.formErrors
                  ? state.formErrors[0]
                  : undefined
            }
            defaultValue={
              state?.data.confirmPassword
                ? state?.data.confirmPassword?.toString()
                : undefined
            }
            required
          />
        </div>
        <Button text="Cadastrar" disabled={isLoading} />
      </form>
      <div className="my-3 p-6 border border-gray-500 rounded-[0.625rem] grid gap-5">
        <div>
          <h3 className="text-gray-200 font-bold">Já uma conta?</h3>
          <p className="text-xs text-gray-300">Entre agora mesmo</p>
        </div>
        <a
          href="/"
          className="block"
          onClick={(event) => isLoading && event.preventDefault()}
        >
          <Button
            text="Acessar conta"
            variant="secondary"
            disabled={isLoading}
          />
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
      />
    </div>
  )
}
