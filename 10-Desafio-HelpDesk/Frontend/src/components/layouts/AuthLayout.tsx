import { Outlet } from 'react-router'

// @ts-expect-error TS2307
import Logo from '../../assets/logo-light.svg?react'
import bgImage from '../../assets/login-background.png'

export function AuthLayout() {
  return (
    <div style={{ backgroundImage: `url(${bgImage})` }} className="flex">
      <div className="lg:w-[50%] lg:ml-auto">
        <main className="min-h-screen w-screen lg:w-auto mt-8 lg:mt-3 px-6 pt-12 lg:px-36 py-8 rounded-t-[1.25rem] bg-gray-600">
          <div className="mb-6 lg:mb-8 flex justify-center items-center gap-3">
            <Logo className="w-10 h-10" />
            <h1 className="text-blue-dark text-xl">HelpDesk</h1>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
