import { useState, type Dispatch, type SetStateAction } from 'react'
import { Client, type ClientActions } from '../../../components/table/Client'
import { useUserServices } from '../../../services/users'
import type {
  IndexUserQuery,
  PutUserBody,
  UserWithoutPassword,
} from '../../../dtos/user'
import type { CurrentAction } from '../../../types/dialog'
import type { PaginationType } from '../../../types/utils'

interface useClientListLogicProps {
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setCurrentAction: Dispatch<SetStateAction<CurrentAction>>
  handleCloseDialog: () => void
}

export function useClientListLogic({
  setOpenDialog,
  setCurrentAction,
  handleCloseDialog,
}: useClientListLogicProps) {
  const { indexUsers, deleteUser } = useUserServices()

  const perPage = 7

  const [isDialogLoading, setIsDialogLoading] = useState(false)

  const [clients, setClients] = useState<
    (UserWithoutPassword & {
      _count: { clientRequest: number; technicianRequest: number }
    })[]
  >([])
  const [pagination, setPagination] = useState<null | PaginationType>(null)

  const [client, setClient] = useState<Client | null>(null)

  async function fetchClients({ query = {} }: { query: IndexUserQuery }) {
    try {
      const response = await indexUsers({ query })

      if (response.status === 200) {
        setClients(response.data.users)

        setPagination(response.data.pagination)
      }
    } catch (error: any) {
      setCurrentAction({
        action: 'failure',
        title: 'Erro ao buscar chamado',
        message: error.response?.data?.message ?? error.message,
        handleAction: () => handleCloseDialog,
      })

      setOpenDialog(true)
    }
  }

  function editClient({ id, body }: { id: string; body: PutUserBody }) {
    setIsDialogLoading(true)
    console.log({ id, body })
    try {
      setCurrentAction({
        action: 'success',
        title: 'Cliente editado com sucesso!',
        handleAction: handleCloseDialog,
      })
    } catch (error: any) {
      setCurrentAction({
        action: 'failure',
        title: 'Erro ao editar o cliente',
        handleAction: handleCloseDialog,
      })
    } finally {
      setIsDialogLoading(false)
    }
  }

  async function removeClient({ id }: { id: string }) {
    setIsDialogLoading(true)
    try {
      const response = await deleteUser({ id })

      if (response.status === 200) {
        setClients((prev) => prev.filter((user) => user.id !== id))

        setCurrentAction({
          action: 'success',
          title: 'Cliente removido',
          message:
            'O cliente e todos chamados vinculados a ele foram excluídos',
          handleAction: handleCloseDialog,
        })
      }
    } catch (error: any) {
      setCurrentAction({
        action: 'failure',
        title: 'Erro ao remover o cliente',
        message: error.response?.data?.message ?? error.message,
        handleAction: () => handleCloseDialog,
      })
    } finally {
      setIsDialogLoading(false)
    }
  }

  function clientOperations(client: Client, clientAction: ClientActions) {
    setCurrentAction({
      action: clientAction.action,
      title: clientAction.title,
      handleAction:
        clientAction.action === 'edit'
          ? () =>
              editClient({
                id: client.id,
                body: { name: client.name, email: client.email },
              })
          : () => removeClient({ id: client.id }),
    })
    setClient(client)
    setOpenDialog(true)
  }

  return {
    clients,
    pagination,
    perPage,
    isDialogLoading,
    fetchClients,
    clientOperations,
    client,
    setClient,
  }
}
