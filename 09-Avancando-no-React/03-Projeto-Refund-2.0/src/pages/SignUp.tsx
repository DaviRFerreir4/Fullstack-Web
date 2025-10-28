import { useState } from 'react'
import { z, ZodError } from 'zod'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Link } from '../components/Link'

const signUpSchema = z
  .object({
    name: z
      .string({ message: 'Nome é obrigatório' })
      .trim()
      .min(2, { message: 'Nome deve conter 2 ou mais caracteres' }),
    email: z.email({ message: 'E-mail inválido' }).trim().toLowerCase(),
    password: z
      .string({ message: 'Senha é obrigatória' })
      .trim()
      .min(8, { message: 'A senha deve possuir pelo menos 8 digitos' }),
    passwordConfirm: z.string({ message: 'Confirme a senha' }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não são iguais',
    path: ['passwordConfirm'],
  })

export function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setIsLoading(true)

      const data = signUpSchema.parse({
        name,
        email,
        password,
        passwordConfirm,
      })
    } catch (error) {
      if (error instanceof ZodError) {
        return alert(error.issues[0].message)
      }

      alert('Não foi possível cadastrar o usuário.\nTente novamente mais tarde')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
        <Input
          required
          legend="Nome"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          required
          legend="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          required
          legend="Senha"
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          required
          legend="Confirme a senha"
          type="password"
          placeholder="******"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <Button type="submit" isLoading={isLoading}>
          Cadastrar
        </Button>
      </form>

      <Link href="/">Já tenho uma conta</Link>
    </>
  )
}
