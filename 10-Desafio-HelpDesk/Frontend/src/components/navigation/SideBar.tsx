import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'

import Logo from '../../assets/logo-dark.svg?react'
import RequestIcon from '../../assets/icons/clipboard-list.svg?react'
import TechnicianIcon from '../../assets/icons/users.svg?react'
import ClientIcon from '../../assets/icons/briefcase-business.svg?react'
import ServicesIcon from '../../assets/icons/wrench.svg?react'
import CreateIcon from '../../assets/icons/plus.svg?react'
import UserCircleIcon from '../../assets/icons/circle-user.svg?react'
import LeaveIcon from '../../assets/icons/log-out.svg?react'
import MenuIcon from '../../assets/icons/menu.svg?react'
import CloseIcon from '../../assets/icons/close.svg?react'

import { SubMenu } from './SubMenu'
import { useIsMobile } from '../../hooks/useIsMobile'

const userRole: string = 'admin'

export function SideBar() {
  const location = useLocation()
  const isMobile = useIsMobile()

  const popoverRef = useRef<HTMLDivElement | null>(null)
  const [isScreenMenuOpen, setIsScreenMenuOpen] = useState(false)

  useEffect(() => {
    const popover = popoverRef.current
    if (!popover) return

    const handleToggle = (event: ToggleEvent) => {
      setIsScreenMenuOpen(event.newState === 'open')
    }

    popover.addEventListener('toggle', handleToggle)

    return () => popover.removeEventListener('toggle', handleToggle)
  }, [])

  return (
    <aside className="pr-6 lg:pr-0 flex items-center justify-between lg:grid lg:grid-rows-[auto_1fr_auto] lg:items-start bg-gray-100">
      <div className="pl-6 lg:pl-0 flex items-center">
        <button
          className="w-min p-2.5 lg:hidden bg-gray-200 text-gray-600"
          popoverTarget={isMobile ? 'screen-menu' : undefined}
          style={{ anchorName: '--screen-menu' }}
        >
          {isScreenMenuOpen ? (
            <CloseIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </button>
        <div className="px-4 lg:px-5 py-6 border-b border-b-gray-200 flex items-center gap-3">
          <Logo className="w-11 h-11" />
          <div className="grid">
            <h2 className="text-lg font-bold text-gray-600">HelpDesk</h2>
            <span className="text-xxs uppercase text-blue-light">
              {userRole}
            </span>
          </div>
        </div>
      </div>
      <div
        className="min-w-[calc(100vw-48px)] lg:min-w-auto px-5 lg:px-4 py-4 lg:py-5 rounded-[0.625rem] lg:grid bg-gray-100"
        id="screen-menu"
        ref={popoverRef}
        {...(isMobile && { popover: 'auto' })}
      >
        {isMobile && (
          <h3 className="mb-4 text-xxs font-bold text-gray-400 uppercase">
            Menu
          </h3>
        )}
        <div className={`${userRole !== 'admin' && 'hidden'}`}>
          <SubMenu
            Icon={RequestIcon}
            text="Chamados"
            href="/requests"
            selected={location.pathname === '/requests' ? true : false}
          />
          <SubMenu
            Icon={TechnicianIcon}
            text="Técnicos"
            href="/technicians"
            selected={location.pathname === '/technicians' ? true : false}
          />
          <SubMenu
            Icon={ClientIcon}
            text="Clientes"
            href="/clients"
            selected={location.pathname === '/clients' ? true : false}
          />
          <SubMenu
            Icon={ServicesIcon}
            text="Serviços"
            href="/services"
            selected={location.pathname === '/services' ? true : false}
          />
        </div>
        <div className={`${userRole !== 'technician' && 'hidden'}`}>
          <SubMenu
            Icon={RequestIcon}
            text="Meus chamados"
            href="/requests"
            selected={location.pathname === '/requests' ? true : false}
          />
        </div>
        <div className={`${userRole !== 'client' && 'hidden'}`}>
          <SubMenu
            Icon={RequestIcon}
            text="Meus chamados"
            href="/requests"
            selected={location.pathname === '/requests' ? true : false}
          />
          <SubMenu
            Icon={CreateIcon}
            text="Criar chamado"
            href="/create"
            selected={location.pathname === '/create' ? true : false}
          />
        </div>
      </div>
      <div>
        <button
          className="w-full lg:px-4 py-5 flex items-center gap-3 text-start outline-none"
          popoverTarget="user-menu"
          style={{ anchorName: '--user-menu' }}
        >
          <span className="w-10 lg:w-8 h-10 lg:h-8 rounded-full flex justify-center items-center bg-blue-dark text-gray-600">
            UA
          </span>
          <div className="hidden lg:grid">
            <span className="text-sm text-gray-600">Usuário Adm</span>
            <span className="text-xs text-gray-400">user.adm@test.com</span>
          </div>
        </button>
        <div
          className="min-w-[calc(100vw-48px)] lg:min-w-50 px-5 py-4 border-2 border-gray-200 rounded-xl bottom-[anchor(bottom)] bg-gray-100"
          id="user-menu"
          popover=""
        >
          <span className="text-xxs text-gray-400 uppercase font-bold">
            Opções
          </span>
          <SubMenu
            Icon={UserCircleIcon}
            href=""
            text="Perfil"
            className="text-gray-500"
          />
          <SubMenu
            Icon={LeaveIcon}
            href=""
            text="Sair"
            className="text-feedback-danger"
          />
        </div>
      </div>
    </aside>
  )
}
