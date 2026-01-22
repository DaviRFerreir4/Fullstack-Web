// @ts-expect-error TS2307
import PlusIcon from '../../assets/icons/plus.svg?react'

import { Button } from '../../components/form/Button'
import { TableHeader } from '../../components/table/TableHeader'
import {
  Technician,
  type ITechnician,
  type ITechnicianAction,
} from '../../components/table/Technician'
import { Dialog } from '../../components/Dialog'
import { useState, useRef } from 'react'
import { useIsMobile } from '../../hooks/useIsMobile'

import { useNavigate } from 'react-router'

export function TechnicianList() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const [technician, setTechnician] = useState<
    Pick<ITechnician, 'id' | 'name'>
  >({
    id: '',
    name: '',
  })

  const [currentAction, setCurrentAction] = useState<null | {
    action: 'remove' | 'success' | 'failure'
    title: string
    handleAction: () => void
  }>(null)

  function removeTechnician() {
    setCurrentAction({
      action: 'success',
      title: 'Técnico removido com sucesso!',
      handleAction: handleCloseDialog,
    })
    // setCurrentAction({
    //   action: 'failure',
    //   title: 'Erro ao remover o técnico',
    //   handleAction: handleCloseDialog,
    // })
  }

  function technicianOperations(
    technician: Pick<ITechnician, 'id' | 'name'>,
    technicianAction: ITechnicianAction
  ) {
    setCurrentAction({
      action: technicianAction.action,
      title: technicianAction.title,
      handleAction: removeTechnician,
    })
    setTechnician(technician)
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    dialogRef.current?.close()
    setOpenDialog(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h1 className="text-lg lg:text-xl font-bold text-blue-dark">
          Técnicos
        </h1>
        <Button
          text={isMobile ? undefined : 'Novo'}
          Icon={PlusIcon}
          size="custom"
          className="px-4 py-2.5 h-10"
          onClick={() => navigate('/technicians/create')}
        />
      </div>
      <table className="w-full border border-gray-500 rounded-xl border-separate">
        <thead>
          <tr>
            <TableHeader text="Nome" />
            <TableHeader text="E-mail" desktopOnly />
            <TableHeader text="Disponibilidade" className="lg:w-85" />
            <TableHeader text="" className="w-21" />
          </tr>
        </thead>
        <tbody>
          {/* {users
            .filter((user) => {
              return user.role === 'technician'
            })
            .map((user) => (
              <Technician
                technicianData={{
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  profilePicture: user.profilePicture,
                  openingHours: user.openingHours ? user.openingHours : [],
                }}
                technicianOperations={technicianOperations}
                key={user.id}
              />
            ))} */}
        </tbody>
      </table>
      <Dialog
        title={currentAction?.title}
        open={openDialog}
        dialogRef={dialogRef}
        closeDialog={handleCloseDialog}
        action={currentAction?.action}
        handleAction={
          currentAction ? currentAction.handleAction : handleCloseDialog
        }
      >
        <div className="grid gap-5">
          <p>
            Deseja realmente excluir <strong>{technician.name}</strong>?
          </p>

          <p>
            Ao exclui-lo, todos os chamados deste técnico serão repassados para
            outros técnicos que possuam a menor quantidade de chamados no
            momento, e esta ação não poderá ser desfeita.
          </p>
        </div>
      </Dialog>
    </div>
  )
}
