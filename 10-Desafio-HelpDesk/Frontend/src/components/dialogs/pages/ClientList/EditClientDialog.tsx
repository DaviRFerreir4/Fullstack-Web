import type { Dispatch, SetStateAction } from 'react'
import { Input } from '../../../form/Input'
import { ProfilePicture } from '../../../ProfilePicture'
import type { Client } from '../../../table/Client'

interface EditClientDialogProps {
  client: Client
  setClient: Dispatch<SetStateAction<Client | null>>
}

export function EditClientDialog({ client, setClient }: EditClientDialogProps) {
  return (
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
  )
}
