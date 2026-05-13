import { TableHeader } from '../components/table/TableHeader'
import { Request } from '../components/table/Request'
import { StatusTag } from '../components/StatusTag'
import { RequestCard } from '../components/RequestCard'

import { useIsMobile } from '../hooks/useIsMobile'
import { useAuth } from '../hooks/useAuth'
import { useEffect } from 'react'
import { Dialog } from '../components/dialogs/Dialog'
import { useResultDialog } from '../hooks/useResultDialog'
import { Pagination } from '../components/navigation/Pagination'
import type { Status } from '../dtos/requests'
import { useRequestListLogic } from '../hooks/screens/useRequestListLogic'

export function RequestList() {
  const { session } = useAuth()

  if (!session) return

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

  const {
    fetchRequests,
    requests,
    pagination,
    technicianRequests,
    technicianPagination,
    changeRequestStatus,
    areRequestCardLoading,
    setAreRequestCardLoading,
  } = useRequestListLogic({
    session,
    setCurrentAction,
    setOpenDialog,
    handleCloseDialog,
  })

  const technicianRequestsKeys: Status[] = ['opened', 'in_progress', 'closed']

  useEffect(() => {
    if (session.user.role === 'technician') {
      for (const status of technicianRequestsKeys) {
        fetchRequests({
          query: {
            perPage: technicianPerPage,
            status,
          },
        })
      }
    } else {
      fetchRequests({
        query: {
          perPage: adminAndClientPerPage,
        },
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
          {pagination?.totalRecords && pagination.totalRecords > 0 ? (
            <Pagination
              onNext={() => {
                fetchRequests({
                  query: {
                    perPage: adminAndClientPerPage,
                    page: (pagination?.page ?? 0) + 1,
                  },
                })
              }}
              onPrevious={() => {
                fetchRequests({
                  query: {
                    perPage: adminAndClientPerPage,
                    page: (pagination?.page ?? 0) - 1,
                  },
                })
              }}
              setPage={(page) => {
                fetchRequests({
                  query: {
                    perPage: adminAndClientPerPage,
                    page,
                  },
                })
              }}
              current={pagination?.page ?? 1}
              total={pagination?.totalPages ?? 1}
            />
          ) : null}
        </>
      ) : (
        <div className="grid gap-6">
          {technicianRequestsKeys.map((key) => (
            <div className="grid gap-4" key={key}>
              <StatusTag status={key} />
              {/* <div className="flex gap-4 overflow-auto snap-x snap-mandatory lg:snap-none"> */}
              <div className="flex gap-4 flex-wrap">
                {technicianRequests?.[key] &&
                  technicianRequests[key].map((request) => (
                    <RequestCard
                      request={request}
                      key={request.id}
                      isLoading={areRequestCardLoading}
                      changeStatus={changeRequestStatus}
                      callback={async (newStatus) => {
                        await fetchRequests({
                          query: {
                            status: key,
                            perPage: technicianPerPage,
                            page:
                              technicianPagination?.[key]?.totalRecords &&
                              technicianPagination[key].totalRecords - 1 > 0 &&
                              technicianPagination[key].page - 1 > 0 &&
                              (technicianPagination[key].totalRecords - 1) %
                                technicianPerPage ===
                                0
                                ? (technicianPagination?.[key]?.page ?? 0) - 1
                                : (technicianPagination?.[key]?.page ?? 0),
                          },
                        })
                        await fetchRequests({
                          query: {
                            status: newStatus,
                            perPage: technicianPerPage,
                            page:
                              technicianPagination?.[newStatus]?.totalRecords &&
                              ((technicianPagination[newStatus].totalRecords +
                                1) %
                                technicianPerPage ===
                                1 ||
                                technicianPerPage === 1)
                                ? technicianPagination[newStatus].totalPages + 1
                                : technicianPagination?.[newStatus]?.page,
                          },
                        })
                        setAreRequestCardLoading(false)
                      }}
                      // className="snap-center lg:snap-align-none"
                    />
                  ))}
              </div>
              {technicianPagination?.[key]?.totalRecords &&
              technicianPagination[key].totalRecords > 0 ? (
                <Pagination
                  onNext={() => {
                    fetchRequests({
                      query: {
                        status: key,
                        perPage: technicianPerPage,
                        page: (technicianPagination?.[key]?.page ?? 0) + 1,
                      },
                    })
                  }}
                  onPrevious={() => {
                    fetchRequests({
                      query: {
                        status: key,
                        perPage: technicianPerPage,
                        page: (technicianPagination?.[key]?.page ?? 1) - 1,
                      },
                    })
                  }}
                  setPage={(page) => {
                    fetchRequests({
                      query: {
                        status: key,
                        perPage: technicianPerPage,
                        page,
                      },
                    })
                  }}
                  current={technicianPagination?.[key]?.page}
                  total={technicianPagination?.[key]?.totalPages}
                />
              ) : null}
            </div>
          ))}
        </div>
      )}
      <Dialog
        open={openDialog}
        dialogRef={dialogRef}
        title={currentAction?.title}
        message={currentAction?.message}
        action={currentAction?.action}
        handleAction={
          currentAction ? currentAction.handleAction : handleCloseDialog
        }
        closeDialog={handleCloseDialog}
        disableCloseAction={currentAction?.disableCloseAction}
      />
    </div>
  )
}
