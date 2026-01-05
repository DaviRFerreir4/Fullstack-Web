import { Outlet } from 'react-router'

import { SideBar } from '../navigation/SideBar'

export function UsersLayout() {
  return (
    <div className="min-h-screen lg:pt-3 grid grid-rows-[auto_1fr] lg:grid-rows-none lg:grid-cols-[auto_1fr] bg-gray-100">
      <SideBar />
      <main className="bg-gray-500 lg:rounded-se-none rounded-t-[1.25rem]">
        <Outlet />
      </main>
    </div>
  )
}
