import { TableHeader } from '../components/table/TableHeader'
import { Request } from '../components/table/Request'
import { StatusTag } from '../components/StatusTag'
import { RequestCard } from '../components/RequestCard'

import dayjs from 'dayjs'
import { requests } from '../data/requests'
import { useIsMobile } from '../hooks/useIsMobile'
import { users } from '../data/users'

const user = users.find((user) => user.id === localStorage.getItem('userid'))
const userRole = user?.role
const userRequests = requests.filter((request) =>
  userRole === 'client'
    ? request.client.id === localStorage.getItem('userid')
    : userRole === 'technician'
    ? request.technician.id === localStorage.getItem('userid')
    : request
)

export function RequestList() {
  if (!user) return

  const isMobile = useIsMobile()

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 text-lg lg:text-xl font-bold text-blue-dark">
        {userRole === 'admin' ? 'Chamados' : 'Meus chamados'}
      </h1>
      {['admin', 'client'].includes(userRole ?? '') ? (
        <table className="w-full border border-gray-500 rounded-xl border-separate">
          <thead>
            <tr>
              <TableHeader text="Atualizado em" />
              <TableHeader text="Id" desktopOnly />
              {userRole === 'client' ? (
                <>
                  <TableHeader text="Título" />
                  <TableHeader text="Serviço" desktopOnly />
                </>
              ) : (
                <TableHeader text="Título e Serviço" />
              )}
              <TableHeader text="Valor total" desktopOnly />
              {userRole !== 'client' && (
                <TableHeader text="Cliente" desktopOnly />
              )}
              <TableHeader text="Técnico" desktopOnly />
              <TableHeader
                text="Status"
                className="lg:w-36.5"
                textCenter={isMobile}
              />
              <TableHeader text="" />
            </tr>
          </thead>
          <tbody>
            {userRequests.map((request) => (
              <Request
                requestData={{
                  id: request.id,
                  text: {
                    title: request.title,
                    service: request.services.sort((a, b) => {
                      return dayjs(a.createdAt).diff(dayjs(b.createdAt))
                    })[0].service.title,
                  },
                  status: request.status,
                  value: Number(
                    request.services
                      .map((service) => service.service.value)
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      )
                  ),
                  client: { name: request.client.name },
                  technician: { name: request.technician.name },
                  date: dayjs(request.updatedAt).format('DD/MM/YYYY HH:mm'),
                }}
                key={request.id}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-4">
            <StatusTag status="opened" />
            {/* <div className="flex gap-4 overflow-auto snap-x snap-mandatory lg:snap-none"> */}
            <div className="flex gap-4 flex-wrap">
              {userRequests
                .filter((request) => request.status === 'opened')
                .map((request) => (
                  <RequestCard
                    request={request}
                    key={request.id}
                    // className="snap-center lg:snap-align-none"
                  />
                ))}
            </div>
          </div>
          <div className="grid gap-4">
            <StatusTag status="in_progress" />
            {/* <div className="flex gap-4 overflow-auto snap-x lg:snap-none"> */}
            <div className="flex gap-4 flex-wrap">
              {userRequests
                .filter((request) => request.status === 'in_progress')
                .map((request) => (
                  <RequestCard
                    request={request}
                    key={request.id}
                    // className="snap-center lg:snap-align-none"
                  />
                ))}
            </div>
          </div>
          <div className="grid gap-4">
            <StatusTag status="closed" />
            {/* <div className="flex gap-4 overflow-auto snap-x lg:snap-none"> */}
            <div className="flex gap-4 flex-wrap">
              {userRequests
                .filter((request) => request.status === 'closed')
                .map((request) => (
                  <RequestCard
                    request={request}
                    key={request.id}
                    // className="snap-center lg:snap-align-none"
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
