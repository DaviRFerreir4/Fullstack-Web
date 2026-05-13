import { useState, type Dispatch, type SetStateAction } from 'react'
import type { UserWithoutPassword } from '../../dtos/user'
import { useUserServices } from '../../services/users'
import type { DialogActions } from '../../types/utils'

interface UseSideBarLogicProps {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setCurrentAction: Dispatch<
    SetStateAction<{
      action: DialogActions
      title: string
      message?: string
      handleAction: (() => void) | ((payload: FormData) => void)
    } | null>
  >
  handleCloseDialog: () => void
}

interface UserActions {
  action: 'edit' | 'changePassword'
  title: string
}

export function useSideBarLogic({
  openDialog,
  setCurrentAction,
  setOpenDialog,
  handleCloseDialog,
}: UseSideBarLogicProps) {
  const { showUser } = useUserServices()

  const [user, setUser] = useState<UserWithoutPassword | null>(null)

  async function fetchUser({ id }: { id: string }) {
    try {
      const response = await showUser({ id })

      setUser(response.data)
    } catch (error: any) {
      setCurrentAction({
        action: 'failure',
        title: error?.response?.data?.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)
    }
  }

  async function editUser() {
    setCurrentAction({
      action: 'success',
      title: 'Usuário editado com sucesso',
      handleAction: handleCloseDialog,
    })
  }

  async function changePassword() {
    setCurrentAction({
      action: 'failure',
      title: 'Não foi possível alterar a senha',
      handleAction: handleCloseDialog,
    })
  }

  function userOperations(serviceAction: UserActions) {
    setCurrentAction({
      action: serviceAction.action,
      title: serviceAction.title,
      handleAction: serviceAction.action === 'edit' ? editUser : changePassword,
    })
    if (!openDialog) setOpenDialog(true)
  }

  return { user, fetchUser, userOperations }
}
