import { useActionState } from 'react'
import z, { ZodError } from 'zod'
import type { TAuthContext } from '../../../contexts/AuthContext'
import type { SignInFormErrors } from '../../../types/forms'
import type { DialogActions } from '../../../types/utils'
import { useSessionServices } from '../../../services/sessions'

interface UseSignInLogicProps {
  auth: TAuthContext
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentAction: React.Dispatch<
    React.SetStateAction<{
      action: DialogActions
      title: string
      message?: string
      handleAction: (() => void) | ((payload: FormData) => void)
    } | null>
  >
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

      const response = await createSession({ email, password })

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
