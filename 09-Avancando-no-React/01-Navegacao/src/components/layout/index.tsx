import './styles.css'

import { Outlet } from 'react-router'

export function Layout() {
  return (
    <div>
      <header>
        <p>Olá, Davi</p>
      </header>

      <Outlet />

      <footer>
        <p>Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
