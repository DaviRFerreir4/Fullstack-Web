import { TableHeader } from '../../components/table/TableHeader'
import {
  Client,
  type IClient,
  type IClientAction,
} from '../../components/table/Client'
import { Dialog } from '../../components/Dialog'
import { ProfilePicture } from '../../components/ProfilePicture'
import { Input } from '../../components/form/Input'
import { useState, useRef } from 'react'

import { users } from '../../data/users'

export function ClientList() {
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const [client, setClient] = useState<IClient>({
    name: '',
    email: '',
    id: '',
    profilePicture: '',
  })

  const [currentAction, setCurrentAction] = useState<null | {
    action: 'edit' | 'remove' | 'success' | 'failure'
    title: string
    handleAction: () => void
  }>(null)

  function editClient() {
    setCurrentAction({
      action: 'success',
      title: 'Cliente editado com sucesso!',
      handleAction: handleCloseDialog,
    })
    // setCurrentAction({
    //   action: 'failure',
    //   title: 'Erro ao editar o cliente',
    //   handleAction: handleCloseDialog,
    // })
  }

  function removeClient() {
    // setCurrentAction({
    //   action: 'success',
    //   title: 'Cliente removido',
    //   handleAction: handleCloseDialog,
    // })
    setCurrentAction({
      action: 'failure',
      title: 'Erro ao remover o cliente',
      handleAction: handleCloseDialog,
    })
  }

  function clientOperations(client: IClient, clientAction: IClientAction) {
    setCurrentAction({
      action: clientAction.action,
      title: clientAction.title,
      handleAction: clientAction.action === 'edit' ? editClient : removeClient,
    })
    setClient(client)
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    dialogRef.current?.close()
    setOpenDialog(false)
  }

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 text-lg lg:text-xl font-bold text-blue-dark">
        Clientes
      </h1>
      <table className="w-full border border-gray-500 rounded-xl border-separate">
        <thead>
          <tr>
            <TableHeader text="Nome" />
            <TableHeader text="E-mail" />
            <TableHeader text="" className="w-21" />
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => {
              return user.role === 'client'
            })
            .map((user) => (
              <Client
                clientData={{
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  profilePicture: user.profilePicture,
                }}
                clientOperations={clientOperations}
                key={user.id}
              />
            ))}
        </tbody>
      </table>
      <Dialog
        title={currentAction?.title}
        open={openDialog}
        dialogRef={dialogRef}
        closeDialog={handleCloseDialog}
        action={currentAction?.action}
        handleAction={currentAction ? currentAction.handleAction : () => {}}
      >
        {currentAction?.action === 'edit' ? (
          <div>
            <ProfilePicture
              username={client.name}
              size="xl"
              profilePicture={client.profilePicture}
            />
            <div className="mt-5 grid gap-4">
              <Input
                label="Nome"
                id="name"
                value={client.name}
                placeholder="Nome completo"
                onChange={(event) =>
                  setClient({ ...client, name: event.target.value })
                }
                required
              />
              <Input
                label="E-mail"
                id="email"
                type="email"
                value={client.email}
                placeholder="exemplo@mail.com"
                onChange={(event) =>
                  setClient({ ...client, email: event.target.value })
                }
                required
              />
            </div>
          </div>
        ) : currentAction?.action === 'remove' ? (
          <div className="grid gap-5">
            <p>
              Deseja realmente excluir <strong>{client.name}</strong>?
            </p>

            <p>
              Ao exclui-lo, todos os chamados deste cliente serão removidos e
              esta ação não poderá ser desfeita.
            </p>
          </div>
        ) : (
          ''
        )}
      </Dialog>
    </div>
  )
}
