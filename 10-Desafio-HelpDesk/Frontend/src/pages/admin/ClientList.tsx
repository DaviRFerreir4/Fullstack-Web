import { TableHeader } from '../../components/table/TableHeader'
import { Dialog } from '../../components/dialogs/Dialog'
import { useResultDialog } from '../../hooks/useResultDialog'
import { useClientListLogic } from '../../hooks/pages/admin/useClientListLogic'
import { useEffect } from 'react'
import { Client } from '../../components/table/Client'
import { Pagination } from '../../components/navigation/Pagination'
import { EditClientDialog } from '../../components/dialogs/pages/ClientList/EditClientDialog'
import { RemoveClientDialog } from '../../components/dialogs/pages/ClientList/RemoveClientDialog'

export function ClientList() {
  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  const {
    clients,
    pagination,
    perPage,
    isDialogLoading,
    fetchClients,
    clientOperations,
    client,
    setClient,
  } = useClientListLogic({
    setOpenDialog,
    setCurrentAction,
    handleCloseDialog,
  })

  useEffect(() => {
    fetchClients({ query: { role: 'client' } })
  }, [])

  return (
    <div>
      <h1 className="mb-4 lg:mb-6 text-lg lg:text-xl font-bold text-blue-dark">
        Clientes
      </h1>
      <table className="w-full mb-4 border border-gray-500 rounded-xl border-separate">
        <thead>
          <tr>
            <TableHeader text="Nome" />
            <TableHeader text="E-mail" />
            <TableHeader text="" className="w-21" />
          </tr>
        </thead>
        <tbody>
          {clients &&
            clients.map((user) => (
              <Client
                clientData={{
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  profilePicture: user.profilePicture,
                  requestsCount: user._count.clientRequest,
                }}
                clientOperations={clientOperations}
                key={user.id}
              />
            ))}
        </tbody>
      </table>
      {pagination?.totalRecords && pagination.totalRecords > 0 ? (
        <Pagination
          onNext={() => {
            fetchClients({
              query: {
                role: 'client',
                perPage,
                page: (pagination?.page ?? 0) + 1,
              },
            })
          }}
          onPrevious={() => {
            fetchClients({
              query: {
                role: 'client',
                perPage,
                page: (pagination?.page ?? 0) - 1,
              },
            })
          }}
          setPage={(page) => {
            fetchClients({
              query: {
                role: 'client',
                perPage,
                page,
              },
            })
          }}
          current={pagination?.page ?? 1}
          total={pagination?.totalPages ?? 1}
        />
      ) : null}
      <Dialog
        open={openDialog}
        dialogRef={dialogRef}
        title={currentAction?.title}
        message={currentAction?.message}
        action={currentAction?.action}
        handleAction={
          currentAction ? currentAction.handleAction : handleCloseDialog
        }
        isFormLoading={isDialogLoading}
        closeDialog={handleCloseDialog}
        disableCloseAction={currentAction?.disableCloseAction}
      >
        {currentAction?.action === 'edit' && client && setClient ? (
          <EditClientDialog client={client} setClient={setClient} />
        ) : currentAction?.action === 'remove' && client ? (
          <RemoveClientDialog client={client} />
        ) : (
          ''
        )}
      </Dialog>
    </div>
  )
}
