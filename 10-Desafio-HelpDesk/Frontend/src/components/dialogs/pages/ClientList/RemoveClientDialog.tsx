import type { Client } from '../../../table/Client'

interface RemoveClientDialogProps {
  client: Pick<Client, 'name' | 'requestsCount'>
}

export function RemoveClientDialog({ client }: RemoveClientDialogProps) {
  return (
    <div className="grid gap-5">
      <p>
        Deseja realmente excluir <strong>{client.name}</strong>?
      </p>

      <p>
        Ao exclui-lo, todos os {client.requestsCount} chamados deste cliente
        serão excluídos, e esta ação não poderá ser desfeita.
      </p>
    </div>
  )
}
