import { useActionState } from 'react'
import { z, ZodError } from 'zod'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Link } from '../components/Link'

const signInSchema = z.object({
  email: z.email({ message: 'E-mail inválido' }).trim().toLowerCase(),
  password: z
    .string({ message: 'Senha é obrigatória' })
    .trim()
    .min(8, { message: 'A senha deve possuir pelo menos 8 digitos' }),
})

export function SignIn() {
  const [state, formAction, isLoading] = useActionState(signIn, null)

  async function signIn(prevState: any, formData: FormData) {
    try {
      const data = signInSchema.parse({
        email: formData.get('email'),
        password: formData.get('password'),
      })

      console.log(data)
    } catch (error) {
      if (error instanceof ZodError) {
        return { message: error.issues[0].message }
      }

      return {
        message: 'Não foi possível fazer login.\nTente novamente mais tarde.',
      }
    }
  }

  return (
    <>
      <form className="w-full flex flex-col gap-4" action={formAction}>
        <Input
          name="email"
          required
          legend="E-mail"
          type="email"
          placeholder="seu@email.com"
        />

        <Input
          name="password"
          required
          legend="Senha"
          type="password"
          placeholder="******"
        />

        <p className="text-sm text-red-600 text-center my-4 font-medium">
          {state?.message}
        </p>

        <Button type="submit" isLoading={isLoading}>
          Entrar
        </Button>
      </form>

      <Link href="/signup">Criar uma conta</Link>
    </>
  )
}
