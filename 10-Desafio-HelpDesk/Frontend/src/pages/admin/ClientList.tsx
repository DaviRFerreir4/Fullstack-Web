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

  function handleOpenDialog(client: {
    name: string
    email: string
    profilePicture?: string
  }) {
    setClient(client)
    setOpenDialog(true)
    return undefined
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
            editClient={handleOpenDialog}
          />
          <Client
            clientData={{
              name: 'Julia Maria',
              email: 'julia.maria@client.com',
            }}
            editClient={handleOpenDialog}
          />
          <Client
            clientData={{
              name: 'Aline Souza',
              email: 'aline.souza@client.com',
            }}
            editClient={handleOpenDialog}
          />
          <Client
            clientData={{
              name: 'Marcelo Andrade',
              email: 'marcelo.andrade@client.com',
            }}
            editClient={handleOpenDialog}
          />
          <Client
            clientData={{
              name: 'Suzane Moura',
              email: 'suzane.moura@client.com',
            }}
            editClient={handleOpenDialog}
          />
        </tbody>
      </table>
      <Dialog
        title="Cliente"
        open={openDialog}
        dialogRef={dialogRef}
        closeDialog={handleCloseDialog}
        handleAction={() => {
          alert('Usuário salvo com sucesso')
          handleCloseDialog()
        }}
      >
        <div className="px-7 mb-6 py-7 border-y border-gray-500">
          <ProfilePicture username={client?.name} size="xl" />
          <div className="mt-5 grid gap-4">
            <Input
              label="Nome"
              value={client?.name}
              onChange={(event) =>
                setClient(
                  client ? { ...client, name: event.target.value } : null
                )
              }
            />
            <Input
              label="E-mail"
              value={client?.email}
              onChange={(event) =>
                setClient(
                  client ? { ...client, email: event.target.value } : null
                )
              }
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}
