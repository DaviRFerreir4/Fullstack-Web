import { TableHeader } from '../../components/table/TableHeader'
import { Client } from '../../components/table/Client'

export function ClientList() {
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
          />
          <Client
            clientData={{
              name: 'Julia Maria',
              email: 'julia.maria@client.com',
            }}
          />
          <Client
            clientData={{
              name: 'Aline Souza',
              email: 'aline.souza@client.com',
            }}
          />
          <Client
            clientData={{
              name: 'Marcelo Andrade',
              email: 'marcelo.andrade@client.com',
            }}
          />
          <Client
            clientData={{
              name: 'Suzane Moura',
              email: 'suzane.moura@client.com',
            }}
          />
        </tbody>
      </table>
    </div>
  )
}
