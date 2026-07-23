import {
  useActionState,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { Client, type ClientActions } from '../../../components/table/Client'
import { useUserServices } from '../../../services/users'
import type {
  IndexUserQuery,
  PutUserBody,
  UserWithoutPassword,
} from '../../../dtos/user'
import type { CurrentAction } from '../../../types/dialog'
import type { PaginationType } from '../../../types/utils'
import z, { ZodError } from 'zod'
import type { EditClientFormErrors } from '../../../types/forms'
import { useUploadServices } from '../../../services/uploads'
import { clearProfilePicturesCache } from '../../components/useProfilePictureLogic'

interface useClientListLogicProps {
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setCurrentAction: Dispatch<SetStateAction<CurrentAction>>
  handleCloseDialog: () => void
}

const editClientSchema = z.object({
  name: z
    .string({ error: 'Informe o nome' })
    .trim()
    .min(3, { error: 'Informe o nome' }),
  email: z.email({ error: 'Informe um e-mail válido' }).trim(),
  image: z.file(),
})

export function useClientListLogic({
  setOpenDialog,
  setCurrentAction,
  handleCloseDialog,
}: useClientListLogicProps) {
  const { indexUsers, putUser, deleteUser } = useUserServices()
  const { createUpload, deleteUpload } = useUploadServices()

  const perPage = 7

  const [isDialogLoading, setIsDialogLoading] = useState(false)

  const [clients, setClients] = useState<
    (UserWithoutPassword & {
      _count: { clientRequest: number; technicianRequest: number }
    })[]
  >([])
  const [pagination, setPagination] = useState<null | PaginationType>(null)

  const [formEditstate, formEditAction, formEditIsLoading] = useActionState(
    editClient,
    null
  )
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

  async function editClient(_: any, formData: FormData) {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      image: formData.get('image'),
    }
    try {
      const { name, email, image } = editClientSchema.parse(data)

      let imageString: string

      if (image.size > 0) {
        imageString = (
          await createUpload({ id: client?.id ?? '', body: image })
        ).data

        clearProfilePicturesCache(client?.id)
      }

      if (image.name === 'none') {
        await deleteUpload({ id: client?.id ?? '' })

        imageString = 'none'

        clearProfilePicturesCache(client?.id)
      }

      await putUser({
        id: client?.id ?? '',
        body: {
          name,
          email: email !== client?.email ? email : undefined,
        },
      })

      setClients((prev) =>
        prev.map((clientArr) =>
          clientArr.id === client?.id
            ? {
                ...clientArr,
                name,
                email,
                profilePicture:
                  imageString !== 'none'
                    ? imageString || clientArr.profilePicture
                    : undefined,
              }
            : clientArr
        )
      )

      setCurrentAction({
        action: 'success',
        title: 'Cliente editado com sucesso!',
        handleAction: handleCloseDialog,
      })
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: EditClientFormErrors =
          z.flattenError(error).fieldErrors
        const formErrors: string[] = z.flattenError(error).formErrors

        return { data, fieldErrors, formErrors }
      }

      setCurrentAction({
        action: 'failure',
        title: error.response.data.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)

      return { data }
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
          ? formEditAction
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
    formEditstate,
    formEditIsLoading,
  }
}
