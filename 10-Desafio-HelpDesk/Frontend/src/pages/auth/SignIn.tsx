import { Input } from '../../components/form/Input'
import { Button } from '../../components/form/Button'
import { useActionState } from 'react'
import z, { ZodError } from 'zod'
import { api } from '../../services/api'
import { useResultDialog } from '../../hooks/useResultDialog'
import { Dialog } from '../../components/Dialog'
import { useAuth } from '../../hooks/useAuth'

const signInSchema = z.object({
  email: z.email({ error: 'Informe um e-mail válido' }).trim(),
  password: z
    .string({ error: 'Informe a senha' })
    .min(8, { error: 'A senha deve conter no mínimo 8 caracteres' })
    .trim(),
})

export function SignIn() {
  const [state, formAction, isLoading] = useActionState(signIn, null)
  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  const auth = useAuth()

  async function signIn(_: any, formData: FormData) {
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    try {
      const { email, password } = signInSchema.parse(data)

      const response = await api.post('/sessions', {
        email,
        password,
      })

      auth.save(response.data)
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: SignInFormErrors = z.flattenError(error).fieldErrors
        const formErrors: string[] = z.flattenError(error).formErrors

        return { data, fieldErrors, formErrors }
      }

      setCurrentAction({
        action: 'failure',
        title: error.response?.data?.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)

      return { data }
    }
  }

  return (
    <div className="w-full">
      <form
        action={formAction}
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
        title={currentAction?.title}
        open={openDialog}
        dialogRef={dialogRef}
        closeDialog={handleCloseDialog}
        action={currentAction?.action}
        handleAction={
          currentAction ? currentAction.handleAction : handleCloseDialog
        }
      />
    </div>
  )
}
