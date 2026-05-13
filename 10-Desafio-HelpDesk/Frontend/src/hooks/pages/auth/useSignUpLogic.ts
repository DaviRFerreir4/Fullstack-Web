import z, { ZodError } from 'zod'
import { useActionState, type Dispatch, type SetStateAction } from 'react'
import type { SignUpFormErrors } from '../../../types/forms'
import { useNavigate } from 'react-router'
import { useUserServices } from '../../../services/users'
import type { CurrentAction } from '../../../types/dialog'

interface UseSignInLogicProps {
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setCurrentAction: Dispatch<SetStateAction<CurrentAction>>
  handleCloseDialog: () => void
}

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

export function useSignUpLogic({
  setOpenDialog,
  setCurrentAction,
  handleCloseDialog,
}: UseSignInLogicProps) {
  const { createUser } = useUserServices()

  const [state, formAction, isLoading] = useActionState(signUp, null)

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

      const response = await createUser({
        body: {
          name,
          email,
          password,
          confirmPassword,
        },
        endpoint: '/users',
      })

      if (response.status === 201) {
        setCurrentAction({
          action: 'success',
          title: 'Usuário cadastrado com sucesso!',
          message:
            'Seu usuário foi cadastrado com sucesso. Clique em "Ok" para seguir para a tela de login',
          handleAction: () => navigate('/signin'),
        })
      } else {
        throw new Error('Erro Inesperado')
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: SignUpFormErrors = z.flattenError(error).fieldErrors
        const formErrors: string[] = z.flattenError(error).formErrors

        return { data, fieldErrors, formErrors }
      }

      setCurrentAction({
        action: 'failure',
        title: 'Erro ao cadastrar novo usuário',
        message: error.response.data.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      return { data }
    } finally {
      setOpenDialog(true)
    }
  }

  return { state, formAction, isLoading }
}
