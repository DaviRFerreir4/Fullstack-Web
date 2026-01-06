import { Outlet } from 'react-router'

import { SideBar } from '../navigation/SideBar'

export function UsersLayout() {
  return (
    <div className="min-h-screen lg:pt-3 grid grid-rows-[auto_1fr] lg:grid-rows-none lg:grid-cols-[auto_1fr] bg-gray-100">
      <SideBar />
      <main className="px-6 lg:px-10 py-7 lg:py-13 lg:rounded-se-none rounded-t-[1.25rem] bg-gray-600">
        <h1 className="mb-4 lg:mb-6 text-lg lg:text-xl font-bold text-blue-dark">
          Chamados
        </h1>
        <Outlet />
      </main>
    </div>
  )
}
