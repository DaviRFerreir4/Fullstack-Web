import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useState } from 'react'

export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    setIsLoading(true)

    console.log({
      email,
      password,
    })

    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <>
      <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
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

        <Button type="submit" isLoading={isLoading}>
          Entrar
        </Button>
      </form>

      <a
        href="/signup"
        className="text-sm text-semibold text-gray-100 mt-8 hover:text-green-800 transition ease-linear w-fit"
      >
        Criar conta
      </a>
    </>
  )
}
