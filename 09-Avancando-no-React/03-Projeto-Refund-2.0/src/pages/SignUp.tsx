import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Link } from '../components/Link'
import { useState } from 'react'

export function SignUp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    setIsLoading(true)

    console.log({
      name,
      email,
      password,
      passwordConfirm,
    })

    setTimeout(() => setIsLoading(false), 2000)
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
