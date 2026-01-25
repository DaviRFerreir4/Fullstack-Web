import { Input } from '../../components/form/Input'
import { Button } from '../../components/form/Button'
import { useActionState } from 'react'
import z, { ZodError } from 'zod'
import { api } from '../../services/api'
import { Dialog } from '../../components/Dialog'
import { useResultDialog } from '../../hooks/useResultDialog'
import { useNavigate } from 'react-router'

const signUpSchema = z
  .object({
    name: z
      .string({ error: 'Informe o nome' })
      .trim()
      .min(3, { error: 'Informe o nome' }),
    email: z.email({ error: 'Informe um e-mail válido' }).trim(),
    password: z
      .string({ error: 'Informe a senha' })
      .trim()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
        error:
          'Senha inválida.\nUma senha deve conter no mínimo 8 digitos e incluir uma letra maíuscula e minúscula, um número e um caractere especial',
      }),
    confirmPassword: z.string({ error: 'Informe a confirmação da senha' }),
  })
  .refine(
    ({ password, confirmPassword }) => {
      return password === confirmPassword
    },
    { error: 'A senha e a confirmação não são iguais' }
  )

export function SignUp() {
  const [state, formAction, isLoading] = useActionState(signUp, null)

  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  const navigate = useNavigate()

  async function signUp(_: any, formData: FormData) {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    }

    try {
      const { name, email, password, confirmPassword } =
        signUpSchema.parse(data)

      const response = await api.post('/users', {
        name,
        email,
        password,
        confirmPassword,
      })

      if (response.status === 201) {
        setCurrentAction({
          action: 'success',
          title: 'Usuário cadastrado com sucesso!',
          handleAction: () => navigate('/signin'),
        })
      } else {
        setCurrentAction({
          action: 'failure',
          title: response.data.message,
          handleAction: handleCloseDialog,
        })
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: SignUpFormErrors = z.flattenError(error).fieldErrors
        const formErrors: string[] = z.flattenError(error).formErrors

        return { data, fieldErrors, formErrors }
      }

      setCurrentAction({
        action: 'failure',
        title: error.response.data.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      return { data }
    } finally {
      setOpenDialog(true)
    }
  }

  return (
    <div className="w-full">
      <form
        action={formAction}
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
