// @ts-expect-error TS2307
import BackIcon from '../assets/icons/arrow-left.svg?react'
// @ts-expect-error TS2307
import ClockIcon from '../assets/icons/clock.svg?react'
// @ts-expect-error TS2307
import DoneIcon from '../assets/icons/circle-check-big.svg?react'
// @ts-expect-error TS2307
import AddIcon from '../assets/icons/plus.svg?react'
// @ts-expect-error TS2307
import RemoveIcon from '../assets/icons/trash.svg?react'

import { Button } from '../components/form/Button'
import { StatusTag } from '../components/StatusTag'
import { InfoField } from '../components/InfoField'
import { ProfilePicture } from '../components/ProfilePicture'

import { useNavigate, useParams } from 'react-router'
import { requests } from '../data/requests'
import dayjs from 'dayjs'
import { users } from '../data/users'
import { useRef, useState } from 'react'
import type { Service } from '../data/services'
import { Dialog } from '../components/Dialog'
import { Input } from '../components/form/Input'

interface IServiceActions {
  action: 'edit' | 'remove'
  title: string
}

const user = users.find((user) => user.id === localStorage.getItem('userid'))
const userRole = user?.role

export function RequestDetails() {
  if (!user) return

  const navigate = useNavigate()
  const params = useParams()

  const dialogRef = useRef<null | HTMLDialogElement>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const [service, setService] = useState<
    Pick<Service, 'id' | 'title'> & { value: string }
  >({
    id: '',
    title: '',
    value: '',
  })

  const [currentAction, setCurrentAction] = useState<null | {
    action: 'edit' | 'remove' | 'success' | 'failure'
    title: string
    handleAction: () => void
  }>(null)

  const request = requests.find((request) => request.id === Number(params.id))

  if (!request) return

  request.services.sort((a, b) => {
    return dayjs(a.createdAt).diff(dayjs(b.createdAt))
  })

  function addService() {
    setCurrentAction({
      action: 'success',
      title: 'Serviço adicionado com sucesso!',
      handleAction: handleCloseDialog,
    })
    // setCurrentAction({
    //   action: 'failure',
    //   title: 'Erro ao adicionar o serviço ao chamado',
    //   handleAction: handleCloseDialog,
    // })
  }

  function removeService() {
    // setCurrentAction({
    //   action: 'success',
    //   title: 'Serviço removido do chamado com sucesso!',
    //   handleAction: handleCloseDialog,
    // })
    setCurrentAction({
      action: 'failure',
      title: 'Erro ao remover o serviço do chamado',
      handleAction: handleCloseDialog,
    })
  }

  function serviceOperations(
    service: Pick<Service, 'id' | 'title'> & { value: string },
    serviceAction: IServiceActions
  ) {
    setCurrentAction({
      action: serviceAction.action,
      title: serviceAction.title,
      handleAction:
        serviceAction.action === 'edit' ? addService : removeService,
    })
    setService({
      ...service,
    })
    setOpenDialog(true)
  }

  function handleCloseDialog() {
    dialogRef.current?.close()
    setOpenDialog(false)
  }

  return (
    <div className="lg:mx-35.5 grid gap-4 lg:gap-6 text-gray-200">
      <div className="grid lg:flex lg:justify-between lg:items-end gap-3">
        <div className="grid gap-1">
          <div
            className="w-fit border-b border-transparent flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-gray-200 hover:border-gray-200 transition cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <BackIcon className="w-3.5 h-3.5" />
            <span>Voltar</span>
          </div>
          <h1 className="text-lg lg:text-xl font-bold text-blue-dark line-clamp-1 wrap-anywhere">
            Chamado detalhado
          </h1>
        </div>
        {userRole !== 'client' && (
          <div className="flex gap-2">
            {userRole === 'admin' &&
              !['in_progress', 'closed'].includes(request.status) && (
                <Button
                  Icon={ClockIcon}
                  text="Em atendimento"
                  variant="secondary"
                  size="custom"
                  className="w-full lg:w-auto lg:px-4 py-2.5 whitespace-nowrap"
                />
              )}
            {request.status !== 'closed' && (
              <Button
                Icon={DoneIcon}
                text={userRole === 'admin' ? 'Encerrado' : 'Encerrar'}
                variant="secondary"
                size="custom"
                className="w-full lg:w-auto lg:px-4 py-2.5"
              />
            )}
            {userRole === 'technician' && request.status === 'opened' && (
              <Button
                Icon={ClockIcon}
                text="Iniciar atendimento"
                size="custom"
                className="w-full lg:w-auto lg:px-4 py-2.5"
              />
            )}
          </div>
        )}
      </div>
      <div className="contents lg:grid lg:items-start lg:grid-cols-[3fr_2fr] lg:gap-x-6 lg:gap-y-3">
        <div className="grid gap-3">
          <div className="p-5 lg:p-6 border border-gray-500 rounded-[0.625rem] grid gap-5">
            <div>
              <div className="mb-0.5 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-300">
                  {request.id.toLocaleString('pt-br', {
                    minimumIntegerDigits: 5,
                    useGrouping: false,
                  })}
                </span>
                <StatusTag status={request.status} />
              </div>
              <h2 className="font-bold">{request.title}</h2>
            </div>
            <InfoField title="Descrição">
              <p className="text-sm">{request.description}</p>
            </InfoField>
            <InfoField title="Categoria">
              <p className="text-sm">{request.services[0].service.title}</p>
            </InfoField>
            <div className="flex gap-8 sm:justify-between">
              <InfoField title="Criado em" className="flex-1">
                <p className="text-xs">
                  {dayjs(request.createdAt).format('DD/MM/YYYY HH:mm')}
                </p>
              </InfoField>
              <InfoField title="Atualizado em" className="flex-1">
                <p className="text-xs">
                  {dayjs(request.updatedAt).format('DD/MM/YYYY HH:mm')}
                </p>
              </InfoField>
            </div>
            <InfoField title="Cliente" spacing="gap-2">
              <div className="flex items-center gap-2">
                <ProfilePicture username={request.client.name} />
                <span className="text-sm">{request.client.name}</span>
              </div>
            </InfoField>
          </div>
        </div>
        <div className="p-5 lg:p-6 border border-gray-500 rounded-[0.625rem] grid gap-8">
          <InfoField title="Técnico Responsável" spacing="gap-2">
            <div className="flex items-center gap-2">
              <ProfilePicture username={request.technician.name} size="md" />
              <div className="grid">
                <span className="text-sm">{request.technician.name}</span>
                <span className="text-xs text-gray-300">
                  {request.technician.email}
                </span>
              </div>
            </div>
          </InfoField>
          <div className="grid gap-4">
            <InfoField title="Valores" spacing="gap-2">
              <div className="flex justify-between text-xs">
                <span>Preço base</span>
                <span>
                  {request.services[0].service.value.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
            </InfoField>
            <InfoField title="Adicionais" spacing="gap-2">
              {request.services
                .slice(1, request.services.length)
                .map(({ service }) => (
                  <div
                    className="flex justify-between text-xs"
                    key={service.id}
                  >
                    <span className="line-clamp-1">{service.title}</span>
                    <span>
                      {service.value.toLocaleString('pt-br', {
                        minimumFractionDigits: 2,
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div>
                ))}
            </InfoField>
            <div className="pt-3 border-t border-gray-500 flex justify-between text-sm font-bold">
              <span>Total</span>
              <span>
                {request.services
                  .map(({ service }) => service.value)
                  .reduce(
                    (accumulator, currentValue) => accumulator + currentValue,
                    0
                  )
                  .toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    style: 'currency',
                    currency: 'BRL',
                  })}
              </span>
            </div>
          </div>
        </div>

        {userRole === 'technician' && request.status !== 'closed' && (
          <div className="p-5 lg:p-6 border border-gray-500 rounded-[0.625rem] grid gap-4">
            <div className="flex justify-between">
              <h3>Serviços adicionais</h3>
              <Button
                Icon={AddIcon}
                size="sm"
                onClick={() =>
                  serviceOperations(service, {
                    action: 'edit',
                    title: 'Serviço adicional',
                  })
                }
              />
            </div>
            {request.services.length > 1 ? (
              request.services
                .slice(1, request.services.length)
                .map(({ service }, index) => (
                  <div className="grid gap-2">
                    <div className="contents">
                      <div className="flex items-center gap-6 text-xs">
                        <span className="flex-1 font-bold line-clamp-1">
                          {service.title}
                        </span>
                        <span>
                          {service.value.toLocaleString('pt-br', {
                            minimumFractionDigits: 2,
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                        <Button
                          Icon={RemoveIcon}
                          iconColor="text-feedback-danger"
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            serviceOperations(
                              {
                                id: service.id,
                                title: service.title,
                                value: service.value.toLocaleString('pt-br', {
                                  minimumFractionDigits: 2,
                                }),
                              },
                              { action: 'remove', title: 'Remover serviço' }
                            )
                          }
                        />
                      </div>
                      {index < request.services.length - 2 && (
                        <hr className="border-gray-500" />
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-xs">
                Adicione um serviço adicional ao chamado caso seja necessário
              </p>
            )}
          </div>
        )}
      </div>
      <Dialog
        title={currentAction?.title}
        open={openDialog}
        dialogRef={dialogRef}
        closeDialog={handleCloseDialog}
        action={currentAction?.action}
        handleAction={currentAction ? currentAction.handleAction : () => {}}
      >
        {currentAction?.action === 'edit' ? (
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
            />
          </div>
        ) : currentAction?.action === 'remove' ? (
          <div className="grid gap-5">
            <p>
              Deseja realmente remover o serviço{' '}
              <strong>{service?.title}</strong> do chamado de nº {request.id}?
            </p>

            <p>
              Ao remove-lo, ele deixará de ser considerado no cálculo de valor
              total do chamado.
            </p>
          </div>
        ) : (
          ''
        )}
      </Dialog>
    </div>
  )
}
