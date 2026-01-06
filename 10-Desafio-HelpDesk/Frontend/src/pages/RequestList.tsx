import { TableHeader } from '../components/table/TableHeader'
import { Request } from '../components/table/Request'

export function RequestList() {
  return (
    <div>
      <table className="w-full border border-gray-500 rounded-xl border-separate">
        <thead>
          <tr>
            <TableHeader text="Atualizado em" />
            <TableHeader text="Id" desktopOnly />
            <TableHeader text="Título e Serviço" />
            <TableHeader text="Valor total" desktopOnly />
            <TableHeader text="Cliente" desktopOnly />
            <TableHeader text="Técnico" desktopOnly />
            <TableHeader text="Status" />
            <TableHeader text="" />
          </tr>
        </thead>
        <tbody>
          <Request
            requestData={{
              date: '13/04/25 20:56',
              id: 3,
              text: { title: 'Rede lenta', service: 'Instalação de Rede' },
              value: 180,
              client: { name: 'André Costa' },
              technician: { name: 'Carlos Silva' },
              status: 'opened',
            }}
          />
          <Request
            requestData={{
              date: '12/04/25 15:20',
              id: 4,
              text: {
                title: 'Backup não está funcionando',
                service: 'Recuperação de Dados',
              },
              value: 200,
              client: { name: 'André Costa' },
              technician: { name: 'Carlos Silva' },
              status: 'opened',
            }}
          />
          <Request
            requestData={{
              date: '12/04/25 09:01',
              id: 1,
              text: {
                title: 'Computador não liga',
                service: 'Manutenção de Hardware',
              },
              value: 150,
              client: { name: 'Aline Souza' },
              technician: { name: 'Carlos Silva' },
              status: 'in_progress',
            }}
          />
          <Request
            requestData={{
              date: '10/04/25 10:15',
              id: 2,
              text: {
                title: 'Instalação de software de gestão',
                service: 'Suporte de Software',
              },
              value: 200,
              client: { name: 'Julia Maria' },
              technician: { name: 'Ana Oliveira' },
              status: 'closed',
            }}
          />
          <Request
            requestData={{
              date: '11/04/25 15:16',
              id: 5,
              text: {
                title: 'Meu fone não conecta no computador',
                service: 'Suporte de Software',
              },
              value: 80,
              client: { name: 'Suzane Moura' },
              technician: { name: 'Ana Oliveira' },
              status: 'closed',
            }}
          />
        </tbody>
      </table>
    </div>
  )
}
