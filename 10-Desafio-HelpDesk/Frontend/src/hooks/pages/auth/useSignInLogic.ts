import { useActionState, type Dispatch, type SetStateAction } from 'react'
import z, { ZodError } from 'zod'
import type { AuthContextType } from '../../../contexts/AuthContext'
import type { SignInFormErrors } from '../../../types/forms'
import { useSessionServices } from '../../../services/sessions'
import type { CurrentAction } from '../../../types/dialog'

interface UseSignInLogicProps {
  auth: AuthContextType
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setCurrentAction: Dispatch<SetStateAction<CurrentAction>>
  handleCloseDialog: () => void
}

const signInSchema = z.object({
  email: z.email({ error: 'Informe um e-mail válido' }).trim(),
  password: z
    .string({ error: 'Informe a senha' })
    .min(8, { error: 'A senha deve conter no mínimo 8 caracteres' })
    .trim(),
})

export function useSignInLogic({
  auth,
  setOpenDialog,
  setCurrentAction,
  handleCloseDialog,
}: UseSignInLogicProps) {
  const { createSession } = useSessionServices()

  const [state, formAction, isLoading] = useActionState(signIn, null)

  async function signIn(_: any, formData: FormData) {
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    try {
      const { email, password } = signInSchema.parse(data)

      const response = await createSession({ body: { email, password } })

      if (response.status === 201) {
        auth.save(response.data)
      } else {
        throw new Error('Erro Inesperado')
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: SignInFormErrors = z.flattenError(error).fieldErrors
        const formErrors: string[] = z.flattenError(error).formErrors

        return { data, fieldErrors, formErrors }
      }

      setCurrentAction({
        action: 'failure',
        title: 'Erro ao fazer login',
        message: error.response?.data?.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)

      return { data }
    }
  }

  return {
    state,
    formAction,
    isLoading,
  }
}
