import { Link } from '../components/Link'

export function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl">Ops! Essa página não existe 😕</h1>
      <Link href="/">
        <span className="text-green-200 hover:text-green-800 font-semibold">
          Voltar para o inicio
        </span>
      </Link>
    </div>
  )
}
