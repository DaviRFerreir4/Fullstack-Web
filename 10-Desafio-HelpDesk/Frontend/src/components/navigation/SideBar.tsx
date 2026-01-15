// @ts-expect-error TS2307
import Logo from '../../assets/logo-dark.svg?react'
// @ts-expect-error TS2307
import RequestIcon from '../../assets/icons/clipboard-list.svg?react'
// @ts-expect-error TS2307
import TechnicianIcon from '../../assets/icons/users.svg?react'
// @ts-expect-error TS2307
import ClientIcon from '../../assets/icons/briefcase-business.svg?react'
// @ts-expect-error TS2307
import ServicesIcon from '../../assets/icons/wrench.svg?react'
// @ts-expect-error TS2307
import CreateIcon from '../../assets/icons/plus.svg?react'
// @ts-expect-error TS2307
import UserCircleIcon from '../../assets/icons/circle-user.svg?react'
// @ts-expect-error TS2307
import LeaveIcon from '../../assets/icons/log-out.svg?react'
// @ts-expect-error TS2307
import MenuIcon from '../../assets/icons/menu.svg?react'
// @ts-expect-error TS2307
import CloseIcon from '../../assets/icons/close.svg?react'
// @ts-expect-error TS2307
import UploadIcon from '../../assets/icons/upload.svg?react'
// @ts-expect-error TS2307
import TrashIcon from '../../assets/icons/trash.svg?react'

import { SubMenu } from './SubMenu'
import { ProfilePicture } from '../ProfilePicture'
import { Dialog } from '../Dialog'
import { Input } from '../form/Input'
import { TimeTag } from '../TimeTag'

import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { useIsMobile } from '../../hooks/useIsMobile'
import { users } from '../../data/users'
import { Button } from '../form/Button'

interface IUserActions {
  action: 'edit' | 'changePassword'
  title: string
}

const user = users.find((user) => user.id === localStorage.getItem('userid'))
const userRole = user?.role

export function SideBar() {
  if (!user) return

  const location = useLocation()
  const isMobile = useIsMobile()

  const popoverRef = useRef<HTMLDivElement | null>(null)
  const [isScreenMenuOpen, setIsScreenMenuOpen] = useState(false)

  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const [currentAction, setCurrentAction] = useState<null | {
    action: 'edit' | 'changePassword' | 'success' | 'failure'
    title: string
    handleAction: () => void
  }>(null)

  function editUser() {
    setCurrentAction({
      action: 'success',
      title: 'Usuário editado com sucesso',
      handleAction: handleCloseDialog,
    })
  }

  function changePassword() {
    setCurrentAction({
      action: 'failure',
      title: 'Não foi possível alterar a senha',
      handleAction: handleCloseDialog,
    })
  }

  function userOperations(serviceAction: IUserActions) {
    setCurrentAction({
      action: serviceAction.action,
      title: serviceAction.title,
      handleAction: serviceAction.action === 'edit' ? editUser : changePassword,
    })
    if (!openDialog) setOpenDialog(true)
  }

  function handleCloseDialog() {
    dialogRef.current?.close()
    setOpenDialog(false)
  }

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
    <aside className="lg:h-[calc(100vh-12px)] lg:sticky lg:top-3 pr-6 lg:pr-0 flex items-center justify-between lg:grid lg:grid-rows-[auto_1fr_auto] lg:items-start bg-gray-100">
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
        <h3 className="mb-4 text-xxs font-bold text-gray-400 uppercase lg:hidden">
          Menu
        </h3>
        <div className={`${userRole !== 'admin' && 'hidden'}`}>
          <SubMenu
            Icon={RequestIcon}
            text="Chamados"
            href="/requests"
            selected={
              ['/requests', '/requests/'].includes(location.pathname)
                ? true
                : false
            }
          />
          <SubMenu
            Icon={TechnicianIcon}
            text="Técnicos"
            href="/technicians"
            selected={
              ['/technicians', '/technicians/'].includes(location.pathname)
                ? true
                : false
            }
          />
          <SubMenu
            Icon={ClientIcon}
            text="Clientes"
            href="/clients"
            selected={
              ['/clients', '/clients/'].includes(location.pathname)
                ? true
                : false
            }
          />
          <SubMenu
            Icon={ServicesIcon}
            text="Serviços"
            href="/services"
            selected={
              ['/services', '/services/'].includes(location.pathname)
                ? true
                : false
            }
          />
        </div>
        <div className={`${userRole !== 'technician' && 'hidden'}`}>
          <SubMenu
            Icon={RequestIcon}
            text="Meus chamados"
            href="/requests"
            selected={
              ['/requests', '/requests/'].includes(location.pathname)
                ? true
                : false
            }
          />
        </div>
        <div className={`${userRole !== 'client' && 'hidden'}`}>
          <SubMenu
            Icon={RequestIcon}
            text="Meus chamados"
            href="/requests"
            selected={
              ['/requests', '/requests/'].includes(location.pathname)
                ? true
                : false
            }
          />
          <SubMenu
            Icon={CreateIcon}
            text="Criar chamado"
            href="/create"
            selected={
              ['/create', '/create/'].includes(location.pathname) ? true : false
            }
          />
        </div>
      </div>
      <div>
        <button
          className="w-full lg:px-4 lg:py-5 flex items-center gap-3 text-start"
          popoverTarget="user-menu"
          style={{ anchorName: '--user-menu' }}
        >
          <ProfilePicture
            username={user.name}
            profilePicture={user.profilePicture}
            size="lg"
          />
          <div className="hidden lg:grid">
            <span className="text-sm text-gray-600">{user.name}</span>
            <span className="text-xs text-gray-400">{user.name}</span>
          </div>
        </button>
        <div
          className="min-w-[calc(100vw-48px)] lg:min-w-50 px-5 py-4 border-2 border-gray-200 rounded-xl bottom-[anchor(bottom)] bg-gray-100"
          id="user-menu"
          popover="auto"
        >
          <span className="mb-4 block text-xxs text-gray-400 uppercase font-bold">
            Opções
          </span>
          <SubMenu
            Icon={UserCircleIcon}
            href=""
            text="Perfil"
            colorClasses="text-gray-500"
            onClick={(event) => {
              event.preventDefault()
              userOperations({ action: 'edit', title: 'Perfil' })
            }}
          />
          <SubMenu
            Icon={LeaveIcon}
            href=""
            text="Sair"
            colorClasses="text-feedback-danger"
            onClick={(event) => {
              event.preventDefault()
            }}
          />
        </div>
      </div>
      <Dialog
        title={currentAction?.title}
        open={openDialog}
        dialogRef={dialogRef}
        closeDialog={handleCloseDialog}
        backAction={() =>
          userOperations({
            action: 'edit',
            title: 'Perfil',
          })
        }
        action={currentAction?.action}
        handleAction={currentAction ? currentAction.handleAction : () => {}}
        useSamePadding={false}
      >
        {currentAction?.action === 'edit' ? (
          <div>
            <div className="mb-5 px-7 flex items-center gap-3">
              <ProfilePicture
                username={user.name}
                profilePicture={user.profilePicture}
                size="xl"
              />
              <div className="h-8 flex items-center gap-1">
                <Button
                  variant="secondary"
                  text="Nova Imagem"
                  Icon={UploadIcon}
                  size="custom"
                  className="h-full px-2"
                />
                {user.profilePicture && (
                  <Button
                    variant="secondary"
                    Icon={TrashIcon}
                    iconColor="text-feedback-danger"
                    size="custom"
                    className="h-full aspect-square"
                  />
                )}
              </div>
            </div>
            <form className="px-7 grid gap-4">
              <Input label="Nome" value={user.name} />
              <Input label="E-mail" value={user.email} />
              <div className="relative">
                <Input
                  label="Senha"
                  type="password"
                  value={'password'}
                  disabled
                />
                <div className="absolute bottom-1/2 right-0 translate-y-2/3">
                  <Button
                    variant="secondary"
                    size="sm"
                    text="Alterar"
                    onClick={(event) => {
                      event.preventDefault()
                      userOperations({
                        action: 'changePassword',
                        title: 'Alterar Senha',
                      })
                    }}
                  />
                </div>
              </div>
            </form>
            {user.role === 'technician' && (
              <div className="mt-8">
                <hr className="mb-5 border-gray-500" />
                <div className="px-7 grid gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-200">
                      Disponibilidade
                    </h3>
                    <p className="text-xs text-gray-300">
                      Horários de atendimento definidos pelo admin
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1 gap-y-2">
                    {user.openingHours?.map((hour) => (
                      <TimeTag hour={hour} disabled />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : currentAction?.action === 'changePassword' ? (
          <div className="px-7 grid gap-4">
            <Input
              label="Senha Atual"
              type="password"
              placeholder="Digite sua senha atual"
            />
            <Input
              label="Nova Senha"
              type="password"
              placeholder="Digite sua nova senha"
              helperText="Mínimo de 6 dígitos"
              info
            />
          </div>
        ) : (
          ''
        )}
      </Dialog>
    </aside>
  )
}
