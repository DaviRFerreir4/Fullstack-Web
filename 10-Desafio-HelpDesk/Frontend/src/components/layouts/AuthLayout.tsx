import { Outlet } from 'react-router'

import logo from '../../assets/logo-light.svg'
import bgImage from '../../assets/login-background.png'

export function AuthLayout() {
  return (
    <div className="h-screen">
      <img src={bgImage} alt="" className="absolute -z-10 inset-0" />
      <main className="h-screen mt-8 px-6 py-8 rounded-[1.25rem] flex flex-col items-center bg-gray-600">
        <div className="flex items-center gap-3">
          <img src={logo} className="w-10 h-10" />
          <h1 className="text-blue-dark text-xl">HelpDesk</h1>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
