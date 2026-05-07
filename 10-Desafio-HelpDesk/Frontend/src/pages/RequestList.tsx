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
import type {
  IndexRequestByUserAPIResponse,
  IndexRequestsQuery,
  Status,
  UserRequest,
} from '../dtos/requests'
import type { TPagination } from '../types/utils'

export function RequestList() {
  const { session } = useAuth()

  if (!session) return

  const [requests, setRequests] = useState<UserRequest[] | null>(null)
  const [pagination, setPagination] = useState<TPagination | null>(null)
  const [technicianRequests, setTechnicianRequests] = useState<{
    opened?: UserRequest[]
    in_progress?: UserRequest[]
    closed?: UserRequest[]
  } | null>(null)
  const [technicianPagination, setTechnicianPagination] = useState<{
    opened?: TPagination
    in_progress?: TPagination
    closed?: TPagination
  } | null>(null)

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
  const technicianPerPage = isMobile ? 1 : 3

  async function fetchRequests(query?: IndexRequestsQuery) {
    const isAdminUser = session?.user.role === 'admin'
    const isTechnicianUser = session?.user.role === 'technician'

    try {
      const response = await api.get<IndexRequestByUserAPIResponse>(
        isAdminUser ? '/requests' : `/users/${session?.user.id}/requests`,
        { params: query }
      )

      if (isTechnicianUser && query?.status) {
        setTechnicianRequests((prev) => ({
          ...prev,
          [query.status as string]: response.data.requests,
        }))

        setTechnicianPagination((prev) => ({
          ...prev,
          [query.status as string]: response.data.pagination,
        }))
      } else {
        setPagination(response.data.pagination)

        setRequests(response.data.requests)
      }
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
    if (session.user.role === 'technician') {
      const technicianStatus: Status[] = ['opened', 'in_progress', 'closed']

      for (const status of technicianStatus) {
        fetchRequests({
          perPage: technicianPerPage,
          status,
        })
      }
    } else {
      fetchRequests({
        perPage: adminAndClientPerPage,
      })
    }
  }, [isMobile])

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
              {technicianRequests?.opened &&
                technicianRequests.opened.map((request) => (
                  <RequestCard
                    request={request}
                    key={request.id}
                    // className="snap-center lg:snap-align-none"
                  />
                ))}
            </div>
            <Pagination
              onNext={() => {
                fetchRequests({
                  status: 'opened',
                  perPage: technicianPerPage,
                  page: (technicianPagination?.opened?.page ?? 0) + 1,
                })
              }}
              onPrevious={() => {
                fetchRequests({
                  status: 'opened',
                  perPage: technicianPerPage,
                  page: (technicianPagination?.opened?.page ?? 1) - 1,
                })
              }}
              setPage={(page) => {
                fetchRequests({
                  status: 'opened',
                  perPage: technicianPerPage,
                  page,
                })
              }}
              current={technicianPagination?.opened?.page}
              total={technicianPagination?.opened?.totalPages}
            />
          </div>
          <div className="grid gap-4">
            <StatusTag status="in_progress" />
            {/* <div className="flex gap-4 overflow-auto snap-x lg:snap-none"> */}
            <div className="flex gap-4 flex-wrap">
              {technicianRequests?.in_progress &&
                technicianRequests.in_progress.map((request) => (
                  <RequestCard
                    request={request}
                    key={request.id}
                    // className="snap-center lg:snap-align-none"
                  />
                ))}
            </div>
            <Pagination
              onNext={() => {
                fetchRequests({
                  status: 'in_progress',
                  perPage: technicianPerPage,
                  page: (technicianPagination?.in_progress?.page ?? 0) + 1,
                })
              }}
              onPrevious={() => {
                fetchRequests({
                  status: 'in_progress',
                  perPage: technicianPerPage,
                  page: (technicianPagination?.in_progress?.page ?? 1) - 1,
                })
              }}
              setPage={(page) => {
                fetchRequests({
                  status: 'in_progress',
                  perPage: technicianPerPage,
                  page,
                })
              }}
              current={technicianPagination?.in_progress?.page}
              total={technicianPagination?.in_progress?.totalPages}
            />
          </div>
          <div className="grid gap-4">
            <StatusTag status="closed" />
            {/* <div className="flex gap-4 overflow-auto snap-x lg:snap-none"> */}
            <div className="flex gap-4 flex-wrap">
              {technicianRequests?.closed &&
                technicianRequests.closed.map((request) => (
                  <RequestCard
                    request={request}
                    key={request.id}
                    // className="snap-center lg:snap-align-none"
                  />
                ))}
            </div>
            <Pagination
              onNext={() => {
                fetchRequests({
                  status: 'closed',
                  perPage: technicianPerPage,
                  page: (technicianPagination?.closed?.page ?? 0) + 1,
                })
              }}
              onPrevious={() => {
                fetchRequests({
                  status: 'closed',
                  perPage: technicianPerPage,
                  page: (technicianPagination?.closed?.page ?? 1) - 1,
                })
              }}
              setPage={(page) => {
                fetchRequests({
                  status: 'closed',
                  perPage: technicianPerPage,
                  page,
                })
              }}
              current={technicianPagination?.closed?.page}
              total={technicianPagination?.closed?.totalPages}
            />
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
