import logoSvg from '../assets/logo.svg'
import logoutIconSvg from '../assets/logout.svg'

// type Props = {}

export function Header() {
  return (
    <header className="w-full flex justify-between md:px-22.5 px-3">
      <img src={logoSvg} alt="Logo" className="my-8" />
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-200">Olá, Davi</span>
        <img
          src={logoutIconSvg}
          alt="Icone de sair"
          className="my-8 cursor-pointer hover:opacity-75 transition ease-linear"
        />
      </div>
    </header>
  )
}
