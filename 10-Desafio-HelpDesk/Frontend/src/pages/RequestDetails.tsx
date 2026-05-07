// @ts-expect-error TS2307
import BackIcon from '../assets/icons/arrow-left.svg?react'
// @ts-expect-error TS2307
import ClockIcon from '../assets/icons/clock.svg?react'
// @ts-expect-error TS2307
import DoneIcon from '../assets/icons/circle-check-big.svg?react'
// @ts-expect-error TS2307
import EditIcon from '../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import AddIcon from '../assets/icons/plus.svg?react'
// @ts-expect-error TS2307
import RemoveIcon from '../assets/icons/trash.svg?react'

import { Button } from '../components/form/Button'
import { StatusTag } from '../components/StatusTag'
import { InfoField } from '../components/InfoField'
import { ProfilePicture } from '../components/ProfilePicture'

import { useNavigate, useParams } from 'react-router'
import dayjs from 'dayjs'
import { useActionState, useEffect, useState } from 'react'
import { Dialog } from '../components/Dialog'
import { Input } from '../components/form/Input'
import { useAuth } from '../hooks/useAuth'
import { useResultDialog } from '../hooks/useResultDialog'
import { api } from '../services/api'
import { CheckboxSlider } from '../components/form/CheckboxSlider'
import { Select } from '../components/form/Select'
import { Autocomplete } from '../components/form/Autocomplete'
import z, { ZodError } from 'zod'
import { AxiosError } from 'axios'
import type { Service } from '../dtos/services'
import type { UserRequest } from '../dtos/requests'
import type { AddServiceFormErrors } from '../types/forms'

interface IServiceActions {
  action: 'edit' | 'remove'
  title: string
}

const useSelect = false

const addServiceSchema = z.object({
  title: z
    .string({ error: 'Informe o título' })
    .min(8, { error: 'O título deve conter ao menos 8 digitos' })
    .nullable(),
  value: z.coerce
    .number({ error: 'Valor inválido' })
    .gt(0, { error: 'O valor deve ser maior que 0' })
    .nullable(),
  service: z.uuid({ error: 'Informe um serviço válido' }).nullable(),
  serviceName: z.string({ error: 'Informe o serviço' }).nullable(),
})

export function RequestDetails() {
  const { session } = useAuth()

  if (!session) return

  const [formAddState, formAddAction, formAddIsLoading] = useActionState(
    addService,
    null
  )

  const [isRmvServiceLoading, setIsRmvServiceLoading] = useState(false)

  const [isNewService, setIsNewService] = useState(false)

  const [serviceName, setServiceName] = useState('')

  const [serviceValue, setServiceValue] = useState('')

  const [services, setServices] = useState<null | Service[]>(null)

  const [serviceId, setServiceId] = useState('')

  const [request, setRequest] = useState<null | Omit<
    UserRequest,
    'assignedTo' | 'requestedBy'
  >>(null)

  const navigate = useNavigate()
  const params = useParams()
  const id = params.id

  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  function clearFields() {
    if (!isNewService) {
      setServiceId('')
    }
    if (serviceName !== '') {
      setServiceName('')
    }
    if (serviceValue !== '') {
      setServiceValue('')
    }
  }

  async function fetchRequest() {
    try {
      const response = await api.get<
        Omit<UserRequest, 'assignedTo' | 'requestedBy'>
      >(`/requests/${id}`)

      setRequest(response.data)
    } catch (error: any) {
      setCurrentAction({
        action: 'failure',
        title: error.response?.data?.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)
    }
  }

  async function fetchServices(query?: string) {
    try {
      const idsToIgnore = request?.services.map(
        (serviceInfo) => serviceInfo.service.id
      )

      const response = await api.get<{ services: Service[] }>('/services', {
        params: {
          title: query,
          perPage: 5,
          idsToIgnore,
          is_active: true,
        },
      })

      const servicesFound = response.data.services

      setServices(servicesFound.length > 0 ? servicesFound : null)
    } catch (error: any) {
      console.log(error)
    }
  }

  async function changeRequestStatus(data: Pick<UserRequest, 'status'>) {
    try {
      const response = await api.patch(`/requests/${request?.id}/status`, data)

      console.log(response)

      if (response.status === 200) {
        setRequest((prev) => ({
          ...(prev as Omit<UserRequest, 'requestedBy' | 'assignedTo'>),
          status: data.status,
        }))

        setCurrentAction({
          action: 'success',
          title: 'Status do chamado alterado com sucesso!',
          handleAction: handleCloseDialog,
        })

        setOpenDialog(true)
      }
    } catch (error: any) {
      let message = 'Não foi possível alterar o status do chamado'

      if (error instanceof AxiosError) {
        message = error.response?.data.message
      }

      setCurrentAction({
        action: 'failure',
        title: message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)
    }
  }

  async function addService(_: any, formData: FormData) {
    const data = {
      title: formData.get('title'),
      value: formData.get('value'),
      service: formData.get('service'),
      serviceName: formData.get('serviceName'),
    }

    try {
      const { title, value, service, serviceName } =
        addServiceSchema.parse(data)

      if (title && value) {
        console.log(title, value)
      } else if (service) {
        console.log(service)
      } else if (serviceName) {
        const serviceData = services?.filter(
          (service) => service.title === serviceName
        )[0]

        if (!serviceData) {
          return { data }
        }

        const newServiceData = {
          createdAt: new Date().toISOString(),
          service: {
            id: serviceData.id,
            isActive: serviceData.isActive,
            title: serviceData.title,
            value: serviceData.value,
          },
        }

        const response = await api.post(`/requests/${request?.id}/service`, {
          serviceId: serviceData.id,
        })

        if (response.status === 201) {
          setRequest({
            ...request,
            services: [
              ...(request?.services as {
                createdAt: string
                service: Omit<Service, 'createdAt' | 'updatedAt'>
              }[]),
              newServiceData,
            ],
          } as Omit<UserRequest, 'assignedTo' | 'requestedBy'> | null)
        }
      } else {
        throw new Error('Nenhum campo informado')
      }

      setCurrentAction({
        action: 'success',
        title: 'Serviço adicionado com sucesso!',
        handleAction: handleCloseDialog,
      })

      clearFields()
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: AddServiceFormErrors =
          z.flattenError(error).fieldErrors
        const formErrors: string[] = z.flattenError(error).formErrors

        return { data, fieldErrors, formErrors }
      }

      let message = 'Erro ao adicionar o serviço ao chamado'

      if (error instanceof AxiosError) {
        message = error.response?.data.message
      }

      clearFields()

      setCurrentAction({
        action: 'failure',
        title: message,
        handleAction: handleCloseDialog,
      })

      return { data }
    }

    return {}
  }

  async function removeService(
    service: Omit<Service, 'createdAt' | 'updatedAt'>
  ) {
    setIsRmvServiceLoading(true)
    try {
      const response = await api.patch(`/requests/${request?.id}/service`, {
        serviceId: service.id,
      })

      if (response.status === 200 && request) {
        const updatedServices = [...request.services]

        updatedServices.splice(
          updatedServices.findIndex(
            (serviceInfo) => serviceInfo.service.title === service?.title
          ),
          1
        )

        setRequest({
          ...request,
          services: updatedServices,
        })
      }

      setCurrentAction({
        action: 'success',
        title: 'Serviço removido do chamado com sucesso!',
        handleAction: handleCloseDialog,
      })
    } catch (error: any) {
      console.log(error)

      let message = 'Erro ao remover o serviço do chamado'

      if (error instanceof AxiosError) {
        message = error.response?.data.message
      }

      setCurrentAction({
        action: 'failure',
        title: message,
        handleAction: handleCloseDialog,
      })
    } finally {
      clearFields()
      setIsRmvServiceLoading(false)
    }
  }

  async function serviceOperations(
    service: Omit<Service, 'createdAt' | 'updatedAt'> | null,
    serviceAction: IServiceActions
  ) {
    if (serviceAction.action === 'edit') {
      await fetchServices()
    }

    if (serviceAction.action === 'remove') {
      setServiceName(service?.title ?? '')
    }

    setCurrentAction({
      action: serviceAction.action,
      title: serviceAction.title,
      handleAction:
        serviceAction.action === 'edit'
          ? formAddAction
          : service
            ? () => removeService(service)
            : () => {},
    })

    setOpenDialog(true)
  }

  useEffect(() => {
    fetchRequest()
  }, [])

  useEffect(() => {
    const matchedService = services?.find(
      (service) => service.title === serviceName
    )

    if (matchedService) {
      setServiceValue(matchedService.value.toString())
      return
    }

    const timer = setTimeout(() => {
      setServiceValue('')
    }, 500)

    return () => clearTimeout(timer)
  }, [serviceName])

  useEffect(() => {
    if (!openDialog) {
      clearFields()
    }
  }, [openDialog])

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
        {session.user.role !== 'client' && (
          <div className={`flex flex-col lg:flex-row gap-2`}>
            <div
              className={`flex gap-2 ${session.user.role === 'admin' ? 'flex-row' : 'flex-row-reverse'} lg:contents`}
            >
              <Button
                Icon={ClockIcon}
                text={
                  session.user.role === 'admin'
                    ? 'Em atendimento'
                    : 'Iniciar atendimento'
                }
                variant={
                  session.user.role === 'admin' ? 'secondary' : 'primary'
                }
                size="custom"
                className={
                  session.user.role === 'admin'
                    ? 'w-full lg:w-auto lg:px-4 py-2.5 whitespace-nowrap'
                    : 'w-full lg:w-auto lg:px-4 py-2.5'
                }
                onClick={() => changeRequestStatus({ status: 'in_progress' })}
                disabled={request?.status === 'in_progress'}
              />

              <Button
                Icon={DoneIcon}
                text={session.user.role === 'admin' ? 'Encerrado' : 'Encerrar'}
                variant="secondary"
                size="custom"
                className="w-full lg:w-auto lg:px-4 py-2.5"
                onClick={() => changeRequestStatus({ status: 'closed' })}
                disabled={request?.status === 'closed'}
              />
            </div>
            {session.user.role === 'admin' && request?.status === 'closed' && (
              <Button
                Icon={EditIcon}
                text="Reabrir o chamado"
                size="custom"
                onClick={() => changeRequestStatus({ status: 'opened' })}
                className="w-full lg:w-auto lg:px-4 py-2.5"
              />
            )}
          </div>
        )}
      </div>
      <div className="contents lg:grid lg:items-start lg:grid-cols-[3fr_2fr] lg:gap-x-6 lg:gap-y-3">
        <div className="p-5 lg:p-6 border border-gray-500 rounded-[0.625rem] grid gap-5">
          <div>
            <div className="mb-0.5 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-300">
                {request?.id.toLocaleString('pt-br', {
                  minimumIntegerDigits: 5,
                  useGrouping: false,
                })}
              </span>
              {request && <StatusTag status={request.status} />}
            </div>
            <h2 className="font-bold">{request?.title}</h2>
          </div>
          <InfoField title="Descrição">
            <p className="text-sm">{request?.description}</p>
          </InfoField>
          <InfoField title="Categoria">
            <p className="text-sm">{request?.services[0].service.title}</p>
          </InfoField>
          <div className="flex gap-8 sm:justify-between">
            <InfoField title="Criado em" className="flex-1">
              <p className="text-xs">
                {dayjs(request?.createdAt).format('DD/MM/YYYY HH:mm')}
              </p>
            </InfoField>
            <InfoField title="Atualizado em" className="flex-1">
              <p className="text-xs">
                {dayjs(request?.updatedAt).format('DD/MM/YYYY HH:mm')}
              </p>
            </InfoField>
          </div>
          {session.user.role !== 'client' && (
            <InfoField title="Cliente" spacing="gap-2">
              <div className="flex items-center gap-2">
                <ProfilePicture
                  username={request?.client?.name ?? ''}
                  profilePicture={request?.client?.profilePicture}
                />
                <span className="text-sm">{request?.client?.name}</span>
              </div>
            </InfoField>
          )}
        </div>
        <div className="p-5 lg:p-6 border border-gray-500 rounded-[0.625rem] grid gap-8">
          <InfoField title="Técnico Responsável" spacing="gap-2">
            <div className="flex items-center gap-2">
              <ProfilePicture
                username={request?.technician?.name ?? ''}
                profilePicture={request?.technician?.profilePicture}
                size="md"
              />
              <div className="grid">
                <span className="text-sm">{request?.technician?.name}</span>
                <span className="text-xs text-gray-300">
                  {request?.technician?.email}
                </span>
              </div>
            </div>
          </InfoField>
          <div className="grid gap-4">
            <InfoField title="Valores" spacing="gap-2">
              <div className="flex justify-between text-xs">
                <span>Preço base</span>
                <span>
                  {request?.services[0].service.value.toLocaleString('pt-br', {
                    minimumFractionDigits: 2,
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
            </InfoField>
            <InfoField title="Adicionais" spacing="gap-2">
              {request?.services
                .slice(1, request?.services.length)
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
                {request?.services
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

        {session.user.role === 'technician' && request?.status !== 'closed' && (
          <div className="p-5 lg:p-6 border border-gray-500 rounded-[0.625rem] grid gap-4">
            <div className="flex gap-4">
              <h3 className="flex-1">Serviços adicionais</h3>
              <Button
                Icon={AddIcon}
                size="sm"
                onClick={() =>
                  serviceOperations(null, {
                    action: 'edit',
                    title: 'Serviço adicional',
                  })
                }
              />
            </div>
            {request && request.services.length > 1 ? (
              request.services
                .slice(1, request.services.length)
                .map(({ service }, index) => (
                  <div className="grid gap-2" key={service.id}>
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
                            serviceOperations(service, {
                              action: 'remove',
                              title: 'Remover serviço',
                            })
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
        handleAction={
          currentAction ? currentAction.handleAction : handleCloseDialog
        }
        isFormLoading={
          currentAction?.action === 'edit'
            ? formAddIsLoading
            : isRmvServiceLoading
        }
      >
        {currentAction?.action === 'edit' ? (
          <div className="grid gap-4">
            <CheckboxSlider
              text="Serviço novo"
              defaultChecked={isNewService}
              onChange={(event) => {
                setIsNewService(event.target.checked)
                delete formAddState?.data
                delete formAddState?.fieldErrors
                delete formAddState?.formErrors
                clearFields()
              }}
            />
            {isNewService ? (
              <div className="grid gap-4">
                <Input
                  label="Título"
                  name="title"
                  id="title"
                  placeholder="Nome do serviço"
                  error={!!formAddState?.fieldErrors?.title}
                  helperText={
                    formAddState?.fieldErrors?.title
                      ? formAddState?.fieldErrors?.title[0]
                      : undefined
                  }
                  defaultValue={
                    formAddState?.data?.title
                      ? formAddState?.data.title?.toString()
                      : ''
                  }
                  required
                />
                <Input
                  key="key-new"
                  label="Valor"
                  name="value"
                  id="value"
                  type="number"
                  currency
                  placeholder="0,00"
                  error={!!formAddState?.fieldErrors?.value}
                  helperText={
                    formAddState?.fieldErrors?.value
                      ? formAddState?.fieldErrors?.value[0]
                      : undefined
                  }
                  defaultValue={
                    formAddState?.data?.value
                      ? formAddState?.data.value?.toString()
                      : ''
                  }
                  required
                />
              </div>
            ) : useSelect ? (
              <div className="grid gap-4">
                <Select
                  label="Serviço"
                  name="service"
                  placeholder="Indique o serviço a ser adicionado"
                  options={
                    services
                      ?.filter((service) => service.isActive)
                      .map((service) => {
                        return { text: service.title, value: service.id }
                      }) ?? []
                  }
                  defaultValue={serviceId}
                  selectValue={serviceId}
                  onChange={(event) => setServiceId(event.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="grid gap-4">
                <Autocomplete
                  label="Serviços"
                  placeholder="Pesquise o serviço"
                  items={
                    services?.map((service) => ({
                      title: service.title,
                      value: service.id,
                    })) ?? [{ title: 'Nenhum item encontrado', value: '' }]
                  }
                  selectedItem={serviceName}
                  setSelectedItem={setServiceName}
                  name="serviceName"
                  id="serviceName"
                  autoComplete="off"
                  required
                  updateItems={fetchServices}
                />
                <Input
                  key="key-existing"
                  label="Valor"
                  type="number"
                  currency
                  placeholder="0,00"
                  required
                  disabled
                  value={serviceValue}
                />
              </div>
            )}
          </div>
        ) : currentAction?.action === 'remove' ? (
          <div className="grid gap-5">
            <p>
              Deseja realmente remover o serviço <strong>{serviceName}</strong>{' '}
              do chamado de nº {request?.id}?
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
