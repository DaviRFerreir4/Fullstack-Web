import { TableHeader } from '../components/table/TableHeader'
import { Request } from '../components/table/Request'
import { StatusTag } from '../components/StatusTag'
import { RequestCard } from '../components/RequestCard'

import { useIsMobile } from '../hooks/useIsMobile'
import { useAuth } from '../hooks/useAuth'

export function RequestList() {
  const { session } = useAuth()

  if (!session) return

  const isMobile = useIsMobile()

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 text-lg lg:text-xl font-bold text-blue-dark">
        {session.user.role === 'admin' ? 'Chamados' : 'Meus chamados'}
      </h1>
      {['admin', 'client'].includes(session.user.role ?? '') ? (
        <table className="w-full border border-gray-500 rounded-xl border-separate">
          <thead>
            <tr>
              <TableHeader text="Atualizado em" />
              <TableHeader text="Id" desktopOnly />
              {session.user.role === 'client' ? (
                <>
                  <TableHeader text="Título" />
                  <TableHeader text="Serviço" desktopOnly />
                </>
              ) : (
                <TableHeader text="Título e Serviço" />
              )}
              <TableHeader text="Valor total" desktopOnly />
              {session.user.role !== 'client' && (
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
            {/* {userRequests.map((request) => (
              <Request
                requestData={{
                  id: request.id,
                  title: request.title,
                  services: request.services,
                  status: request.status,
                  client: request.client,
                  technician: request.technician,
                  updatedAt: request.updatedAt,
                }}
                key={request.id}
              />
            ))} */}
          </tbody>
        </table>
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-4">
            <StatusTag status="opened" />
            {/* <div className="flex gap-4 overflow-auto snap-x snap-mandatory lg:snap-none"> */}
            <div className="flex gap-4 flex-wrap">
              {/* {userRequests
                .filter((request) => request.status === 'opened')
                .map((request) => (
                  <RequestCard
                    request={request}
                    key={request.id}
                    // className="snap-center lg:snap-align-none"
                  />
                ))} */}
            </div>
          </div>
          <div className="grid gap-4">
            <StatusTag status="in_progress" />
            {/* <div className="flex gap-4 overflow-auto snap-x lg:snap-none"> */}
            <div className="flex gap-4 flex-wrap">
              {/* {userRequests
                .filter((request) => request.status === 'in_progress')
                .map((request) => (
                  <RequestCard
                    request={request}
                    key={request.id}
                    // className="snap-center lg:snap-align-none"
                  />
                ))} */}
            </div>
          </div>
          <div className="grid gap-4">
            <StatusTag status="closed" />
            {/* <div className="flex gap-4 overflow-auto snap-x lg:snap-none"> */}
            <div className="flex gap-4 flex-wrap">
              {/* {userRequests
                .filter((request) => request.status === 'closed')
                .map((request) => (
                  <RequestCard
                    request={request}
                    key={request.id}
                    // className="snap-center lg:snap-align-none"
                  />
                ))} */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
