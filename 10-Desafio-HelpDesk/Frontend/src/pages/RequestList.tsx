import { TableHeader } from '../components/table/TableHeader'
import { Request } from '../components/table/Request'

import dayjs from 'dayjs'

import { requests } from '../data/requests'

export function RequestList() {
  return (
    <div>
      <h1 className="mb-4 lg:mb-6 text-lg lg:text-xl font-bold text-blue-dark">
        Chamados
      </h1>
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
          {requests.map((request) => (
            <Request
              requestData={{
                id: request.id,
                text: {
                  title: request.title,
                  service: request.services
                    .map((service) => service.title)
                    .join(', '),
                },
                status: 'opened',
                value: Number(
                  request.services
                    .map((service) => service.value)
                    .reduce(
                      (accumulator, currentValue) => accumulator + currentValue,
                      0
                    )
                ),
                client: { name: request.client.name },
                technician: { name: request.technician.name },
                date: dayjs(request.createdAt).format('DD/MM/YYYY HH:mm'),
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
