import { TableHeader } from '../components/table/TableHeader'
import { Request } from '../components/table/Request'
import { StatusTag } from '../components/StatusTag'
import { RequestCard } from '../components/RequestCard'

import { useIsMobile } from '../hooks/useIsMobile'
import { useAuth } from '../hooks/useAuth'
import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { Dialog } from '../components/Dialog'
import { useResultDialog } from '../hooks/useResultDialog'
import { Pagination } from '../components/navigation/Pagination'

export function RequestList() {
  const { session } = useAuth()

  if (!session) return

  const [requests, setRequests] = useState<UserRequest[] | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)

  const isMobile = useIsMobile()

  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  const adminAndClientPerPage = 7
  const technicianPerPage = 3

  async function fetchRequests(query?: IndexRequestsQuery) {
    const isAdminUser = session?.user.role === 'admin'

    try {
      const response = await api.get<IndexRequestByUserAPIResponse>(
        isAdminUser ? '/requests' : `/users/${session?.user.id}/requests`,
        { params: query }
      )

      setPagination(response.data.pagination)

      setRequests(response.data.requests)
    } catch (error: any) {
      setCurrentAction({
        action: 'failure',
        title: error?.response?.data?.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)
    }
  }

  useEffect(() => {
    fetchRequests({
      perPage:
        session.user.role === 'technician'
          ? technicianPerPage
          : adminAndClientPerPage,
    })
  }, [])

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 text-lg lg:text-xl font-bold text-blue-dark">
        {session.user.role === 'admin' ? 'Chamados' : 'Meus chamados'}
      </h1>
      {['admin', 'client'].includes(session.user.role ?? '') ? (
        <>
          <table className="w-full mb-4 border border-gray-500 rounded-xl border-separate">
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
              {requests &&
                requests.map((request) => (
                  <Request
                    requestData={{
                      id: request.id,
                      title: request.title,
                      updatedAt: request.updatedAt,
                      services: request.services,
                      status: request.status,
                      client: request.client,
                      technician: request.technician,
                    }}
                    key={request.id}
                  />
                ))}
            </tbody>
          </table>
          <Pagination
            onNext={() => {
              fetchRequests({
                perPage: adminAndClientPerPage,
                page: (pagination?.page ?? 0) + 1,
              })
            }}
            onPrevious={() => {
              fetchRequests({
                perPage: adminAndClientPerPage,
                page: (pagination?.page ?? 0) - 1,
              })
            }}
            setPage={(page) => {
              fetchRequests({
                perPage: adminAndClientPerPage,
                page,
              })
            }}
            current={pagination?.page ?? 1}
            total={pagination?.totalPages ?? 1}
          />
        </>
      ) : (
        <div className="grid gap-6">
          <div className="grid gap-4">
            <StatusTag status="opened" />
            {/* <div className="flex gap-4 overflow-auto snap-x snap-mandatory lg:snap-none"> */}
            <div className="flex gap-4 flex-wrap">
              {requests
                ?.filter((request) => request.status === 'opened')
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
              {requests
                ?.filter((request) => request.status === 'in_progress')
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
              {requests
                ?.filter((request) => request.status === 'closed')
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
      <Dialog
        title={currentAction?.title}
        open={openDialog}
        dialogRef={dialogRef}
        closeDialog={handleCloseDialog}
        action={currentAction?.action}
        handleAction={
          currentAction ? currentAction.handleAction : handleCloseDialog
        }
      />
    </div>
  )
}
