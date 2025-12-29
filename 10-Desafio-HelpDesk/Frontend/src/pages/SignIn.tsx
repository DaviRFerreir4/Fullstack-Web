import { Input } from '../components/form/Input'
import { Button } from '../components/form/Button'

export function SignIn() {
  return (
    <div className="w-full">
      <form className="mt-6 p-6 border border-gray-500 rounded-[0.625rem] grid gap-8">
        <div>
          <h2 className="text-lg text-gray-200 font-bold">Acesse o portal</h2>
          <p className="text-xs text-gray-300">
            Entre usando seu e-mail e senha cadastrados
          </p>
        </div>
        <div className="grid gap-4">
          <Input
            label="E-mail"
            id="email"
            type="text"
            placeholder="exemplo@mail.com"
          />
          <Input
            label="Senha"
            id="password"
            type="password"
            placeholder="Digite sua senha"
            error={true}
          />
        </div>
        <Button text="Entrar" />
      </form>
      <div className="my-3 p-6 border border-gray-500 rounded-[0.625rem] grid gap-5">
        <div>
          <h3 className="text-gray-200 font-bold">Ainda não tem uma conta?</h3>
          <p className="text-xs text-gray-300">Cadastre agora mesmo</p>
        </div>
        <Button text="Criar conta" variant="secondary" />
      </div>
    </div>
  )
}
