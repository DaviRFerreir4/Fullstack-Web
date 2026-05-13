import {
  useActionState,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'
import z, { ZodError } from 'zod'
import type { Service } from '../../dtos/services'
import type { UserRequest } from '../../dtos/requests'
import { useRequestServices } from '../../services/requests'
import { useServiceServices } from '../../services/services'
import { AxiosError } from 'axios'
import type { AddServiceFormErrors } from '../../types/forms'
import type { NavigateFunction } from 'react-router'
import type { CurrentAction } from '../../types/dialog'

interface UseRequestDetailsLogicProps {
  requestId: number
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setCurrentAction: Dispatch<SetStateAction<CurrentAction>>
  handleCloseDialog: () => void
  navigate: NavigateFunction
}

interface IServiceActions {
  action: 'edit' | 'remove'
  title: string
}

const useSelect = false
const useNewService = false

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

export function useRequestDetailsLogic({
  requestId,
  setOpenDialog,
  setCurrentAction,
  handleCloseDialog,
  navigate,
}: UseRequestDetailsLogicProps) {
  const {
    showRequest,
    createRequestService,
    patchRequestService,
    patchRequestStatus,
  } = useRequestServices()
  const { indexServices } = useServiceServices()

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
      const response = await showRequest({ id: requestId })

      setRequest(response.data)
    } catch (error: any) {
      setCurrentAction({
        action: 'failure',
        title: 'Erro ao buscar chamado',
        message: error.response?.data?.message ?? error.message,
        handleAction: () => navigate('/requests'),
        disableCloseAction: true,
      })

      setOpenDialog(true)
    }
  }

  async function fetchServices(title?: string) {
    try {
      const idsToIgnore = request?.services.map(
        (serviceInfo) => serviceInfo.service.id
      )

      const response = await indexServices({
        query: { title, perPage: 5, idsToIgnore, is_active: true },
      })

      const servicesFound = response.data.services

      setServices(servicesFound.length > 0 ? servicesFound : null)
    } catch (error: any) {
      console.log(error)
    }
  }

  async function changeRequestStatus(body: Pick<UserRequest, 'status'>) {
    try {
      const { status } = body
      const response = await patchRequestStatus({
        id: request?.id ?? -1,
        body: { status },
      })

      if (response.status === 200) {
        setRequest((prev) => ({
          ...(prev as Omit<UserRequest, 'requestedBy' | 'assignedTo'>),
          status,
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

        const response = await createRequestService({
          id: request?.id ?? -1,
          body: { serviceId: serviceData.id },
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

    const serviceId = service.id

    try {
      const response = await patchRequestService({
        id: request?.id ?? -1,
        body: { serviceId },
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

  return {
    useNewService,
    useSelect,
    formAddState,
    formAddIsLoading,
    isRmvServiceLoading,
    isNewService,
    setIsNewService,
    serviceName,
    setServiceName,
    serviceValue,
    setServiceValue,
    services,
    serviceId,
    setServiceId,
    request,
    clearFields,
    fetchRequest,
    fetchServices,
    changeRequestStatus,
    serviceOperations,
  }
}
