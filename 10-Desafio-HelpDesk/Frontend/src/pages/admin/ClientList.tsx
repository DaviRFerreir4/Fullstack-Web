import { TableHeader } from '../../components/table/TableHeader'
import { Client } from '../../components/table/Client'
import { Dialog } from '../../components/Dialog'
import { ProfilePicture } from '../../components/ProfilePicture'
import { Input } from '../../components/form/Input'
import { useRef, useState } from 'react'

export function ClientList() {
  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const [client, setClient] = useState<null | {
    name: string
    email: string
    profilePicture?: string
  }>(null)

  const [action, setAction] = useState<null | {
    action: 'save' | 'remove' | 'success' | 'failure'
    title: string
    handleAction: () => void
  }>(null)

  function editClient() {
    setAction({
      action: 'success',
      title: 'Cliente editado',
      handleAction: handleCloseDialog,
    })
    // setAction({
    //   action: 'failure',
    //   title: 'Erro ao editar o cliente',
    //   handleAction: handleCloseDialog,
    // })
  }

  function removeClient() {
    // setAction({
    //   action: 'success',
    //   title: 'Cliente removido',
    //   handleAction: handleCloseDialog,
    // })
    setAction({
      action: 'failure',
      title: 'Erro ao remover o cliente',
      handleAction: handleCloseDialog,
    })
  }

  function clientOperations(
    client: {
      name: string
      email: string
      profilePicture?: string
    },
    clientAction: { action: 'save' | 'remove'; title: string }
  ) {
    switch (clientAction.action) {
      case 'save':
        setAction({
          action: clientAction.action,
          title: clientAction.title,
          handleAction: editClient,
        })
        break
      case 'remove':
        setAction({
          action: clientAction.action,
          title: clientAction.title,
          handleAction: removeClient,
        })
        break
    }
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
          <Client
            clientData={{
              name: 'André Costa',
              email: 'andre.costa@client.com',
            }}
            clientOperations={clientOperations}
          />
          <Client
            clientData={{
              name: 'Julia Maria',
              email: 'julia.maria@client.com',
            }}
            clientOperations={clientOperations}
          />
          <Client
            clientData={{
              name: 'Aline Souza',
              email: 'aline.souza@client.com',
            }}
            clientOperations={clientOperations}
          />
          <Client
            clientData={{
              name: 'Marcelo Andrade',
              email: 'marcelo.andrade@client.com',
            }}
            clientOperations={clientOperations}
          />
          <Client
            clientData={{
              name: 'Suzane Moura',
              email: 'suzane.moura@client.com',
            }}
            clientOperations={clientOperations}
          />
        </tbody>
      </table>
      <Dialog
        title={action?.title}
        open={openDialog}
        dialogRef={dialogRef}
        closeDialog={handleCloseDialog}
        action={action?.action}
        handleAction={action ? action.handleAction : () => {}}
      >
        {action?.action === 'save' ? (
          <div>
            <ProfilePicture username={client?.name} size="xl" />
            <div className="mt-5 grid gap-4">
              <Input
                label="Nome"
                value={client?.name}
                placeholder="Nome completo"
                onChange={(event) =>
                  setClient(
                    client ? { ...client, name: event.target.value } : null
                  )
                }
              />
              <Input
                label="E-mail"
                value={client?.email}
                placeholder="exemplo@mail.com"
                onChange={(event) =>
                  setClient(
                    client ? { ...client, email: event.target.value } : null
                  )
                }
              />
            </div>
          </div>
        ) : action?.action === 'remove' ? (
          <div className="grid gap-5">
            <p>
              Deseja realmente excluir <strong>{client?.name}</strong>?
            </p>

            <p>
              Ao excluir, todos os chamados deste cliente serão removidos e esta
              ação não poderá ser desfeita.
            </p>
          </div>
        ) : (
          ''
        )}
      </Dialog>
    </div>
  )
}
