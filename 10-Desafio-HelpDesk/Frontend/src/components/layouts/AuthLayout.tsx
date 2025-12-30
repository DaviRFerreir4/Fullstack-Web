import { Outlet } from 'react-router'

import logo from '../../assets/logo-light.svg'
import bgImage from '../../assets/login-background.png'

export function AuthLayout() {
  return (
    <div style={{ backgroundImage: `url(${bgImage})` }} className="flex">
      <div className="lg:w-[50%] ml-auto">
        <main className="min-h-screen mt-8 lg:mt-3 px-6 pt-12 lg:px-36 py-8 rounded-t-[1.25rem] flex flex-col items-center bg-gray-600">
          <div className="flex items-center gap-3">
            <img src={logo} className="w-10 h-10" />
            <h1 className="text-blue-dark text-xl">HelpDesk</h1>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
