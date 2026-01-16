import { Input } from '../../components/form/Input'
import { Button } from '../../components/form/Button'

export function SignUp() {
  return (
    <div className="w-full">
      <form className="p-6 border border-gray-500 rounded-[0.625rem] grid gap-8">
        <div>
          <h2 className="text-lg text-gray-200 font-bold">Crie sua conta</h2>
          <p className="text-xs text-gray-300">
            Informe seu nome, e-mail e senha
          </p>
        </div>
        <div className="grid gap-4">
          <Input
            label="Nome"
            id="name"
            placeholder="Digite o nome completo"
            required
          />
          <Input
            label="E-mail"
            id="email"
            type="email"
            placeholder="exemplo@mail.com"
            required
          />
          <Input
            label="Senha"
            id="password"
            type="password"
            placeholder="Digite sua senha"
            info={true}
            helperText="Mínimo de 6 dígitos"
            required
          />
        </div>
        <Button text="Cadastrar" />
      </form>
      <div className="my-3 p-6 border border-gray-500 rounded-[0.625rem] grid gap-5">
        <div>
          <h3 className="text-gray-200 font-bold">Já uma conta?</h3>
          <p className="text-xs text-gray-300">Entre agora mesmo</p>
        </div>
        <a href="/" className="block">
          <Button text="Acessar conta" variant="secondary" />
        </a>
      </div>
    </div>
  )
}
