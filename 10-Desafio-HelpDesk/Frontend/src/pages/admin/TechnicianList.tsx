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

export function TechnicianList() {
  const isMobile = useIsMobile()

  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const [technician, setTechnician] = useState<ITechnician>({
    name: '',
    email: '',
    availability: [],
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
    technician: ITechnician,
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
          <Technician
            technicianData={{
              name: 'Carlo Silva',
              email: 'carlos.silva@email.com',
              availability: [8, 9, 10, 11, 13, 14, 15, 16],
            }}
            technicianOperations={technicianOperations}
          />
          <Technician
            technicianData={{
              name: 'Ana Oliveira',
              email: 'ana.oliveira@test.com',
              availability: [13, 14, 15, 16],
            }}
            technicianOperations={technicianOperations}
          />
          <Technician
            technicianData={{
              name: 'Cíntia Lúcia',
              email: 'cintia.lucia@test.com',
              availability: [8, 9, 14, 15, 18],
            }}
            technicianOperations={technicianOperations}
          />
          <Technician
            technicianData={{
              name: 'Marcos Alves',
              email: 'marcos.alves@test.com',
              availability: [7, 9, 11, 15, 17, 19, 20],
            }}
            technicianOperations={technicianOperations}
          />
        </tbody>
      </table>
      <Dialog
        title={currentAction?.title}
        open={openDialog}
        dialogRef={dialogRef}
        closeDialog={handleCloseDialog}
        action={currentAction?.action}
        handleAction={currentAction ? currentAction.handleAction : () => {}}
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
