// @ts-expect-error TS2307
import PlusIcon from '../../assets/icons/plus.svg?react'

import { Button } from '../../components/form/Button'
import { TableHeader } from '../../components/table/TableHeader'
import {
  Service,
  type IService,
  type IServiceAction,
} from '../../components/table/Service'
import { Dialog } from '../../components/Dialog'
import { Input } from '../../components/form/Input'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useState, useRef } from 'react'

import { services } from '../../data/services'

export function ServiceList() {
  const isMobile = useIsMobile()

  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const [service, setService] = useState<IService>({
    id: '',
    title: '',
    value: '',
    isActive: true,
  })

  const [currentAction, setCurrentAction] = useState<null | {
    action: 'create' | 'edit' | 'disable' | 'enable' | 'success' | 'failure'
    title: string
    handleAction: () => void
  }>(null)

  function createService() {
    // setCurrentAction({
    //   action: 'success',
    //   title: 'Serviço criado com sucesso!',
    //   handleAction: handleCloseDialog,
    // })
    setCurrentAction({
      action: 'failure',
      title: 'Erro ao criar o serviço',
      handleAction: handleCloseDialog,
    })
  }

  function editService() {
    setCurrentAction({
      action: 'success',
      title: 'Serviço editado com sucesso!',
      handleAction: handleCloseDialog,
    })
    // setCurrentAction({
    //   action: 'failure',
    //   title: 'Erro ao editar o serviço',
    //   handleAction: handleCloseDialog,
    // })
  }

  function enableService() {
    setCurrentAction({
      action: 'success',
      title: 'Serviço reativado com sucesso!',
      handleAction: handleCloseDialog,
    })
    // setCurrentAction({
    //   action: 'failure',
    //   title: 'Erro ao reativar o serviço',
    //   handleAction: handleCloseDialog,
    // })
  }

  function disableService() {
    // setCurrentAction({
    //   action: 'success',
    //   title: 'Serviço desativado com sucesso!',
    //   handleAction: handleCloseDialog,
    // })
    setCurrentAction({
      action: 'failure',
      title: 'Erro ao desativar o serviço',
      handleAction: handleCloseDialog,
    })
  }

  function serviceOperations(service: IService, serviceAction: IServiceAction) {
    setCurrentAction({
      action: serviceAction.action,
      title: serviceAction.title,
      handleAction:
        serviceAction.action === 'create'
          ? createService
          : serviceAction.action === 'edit'
          ? editService
          : serviceAction.action === 'disable'
          ? disableService
          : enableService,
    })
    setService({
      ...service,
      value:
        service.value === ''
          ? service.value
          : Number(service.value).toLocaleString('pt-br', {
              minimumFractionDigits: 2,
            }),
    })
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
          Serviços
        </h1>
        <Button
          text={isMobile ? undefined : 'Novo'}
          Icon={PlusIcon}
          size="custom"
          className="px-4 py-2.5 h-10"
          onClick={() =>
            serviceOperations(
              { id: '', title: '', value: '', isActive: true },
              {
                action: 'create',
                title: 'Cadastro de serviço',
              }
            )
          }
        />
      </div>
      <table className="w-full border border-gray-500 rounded-xl border-separate table-fixed">
        <thead>
          <tr>
            <TableHeader text="Título" />
            <TableHeader text="Valor" />
            <TableHeader text="Status" className="w-16 lg:w-20.5" textCenter />
            <TableHeader text="" className="w-19 lg:w-36" />
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <Service
              serviceData={{
                id: service.id,
                title: service.title,
                value: service.value.toString(),
                isActive: service.isActive,
              }}
              serviceOperations={serviceOperations}
              key={service.id}
            />
          ))}
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
        {currentAction?.action === 'create' ||
        currentAction?.action === 'edit' ? (
          <div className="grid gap-4">
            <Input
              label="Título"
              id="title"
              placeholder="Nome do serviço"
              value={service?.title}
              onChange={(event) =>
                setService({
                  ...service,
                  title: event.target.value,
                })
              }
              required
            />
            <Input
              label="Valor"
              id="value"
              currency
              placeholder="0,00"
              value={service.value}
              onChange={(event) => {
                const value = event.target.value
                const decimalRegex = /^\d+(\,\d*)?$/

                if (value === '') {
                  setService({ ...service, value: '' })
                }

                if (decimalRegex.test(event.target.value)) {
                  setService({ ...service, value: event.target.value })
                }
              }}
              required
            />
          </div>
        ) : currentAction?.action === 'disable' ? (
          <div className="grid gap-5">
            <p>
              Deseja realmente desativar o serviço{' '}
              <strong>{service?.title}</strong>?
            </p>

            <p>
              Ao desativa-lo, todos os chamados com este serviço permaneceram em
              seu estado atual e poderão ser concluídos caso estejam abertos,
              mas clientes não conseguiram criar chamados novos com ele.
            </p>
          </div>
        ) : currentAction?.action === 'enable' ? (
          <div className="grid gap-5">
            <p>
              Deseja realmente reativar o serviço{' '}
              <strong>{service?.title}</strong>?
            </p>

            <p>Ao reativa-lo, clientes poderão criar novos chamados com ele.</p>
          </div>
        ) : (
          ''
        )}
      </Dialog>
    </div>
  )
}
