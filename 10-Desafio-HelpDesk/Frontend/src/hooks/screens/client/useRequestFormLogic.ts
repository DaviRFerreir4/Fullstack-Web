import { useActionState, useState } from 'react'
import z, { ZodError } from 'zod'
import type { IndexServiceQuery, Service } from '../../../dtos/services'
import { api } from '../../../services/api'
import { useNavigate } from 'react-router'
import type { CreateRequestFormErrors } from '../../../types/forms'
import type { DialogActions } from '../../../types/utils'
import { useServiceServices } from '../../../services/services'

interface UseSignInLogicProps {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentAction: React.Dispatch<
    React.SetStateAction<{
      action: DialogActions
      title: string
      message?: string
      handleAction: (() => void) | ((payload: FormData) => void)
    } | null>
  >
  handleCloseDialog: () => void
}

const createRequestSchema = z.object({
  title: z
    .string({ error: 'Informe o título' })
    .min(8, { error: 'O título deve conter ao menos 8 digitos' }),
  description: z
    .string({ error: 'Informe a descrição' })
    .min(12, { error: 'A descrição deve conter ao menos 12 digitos' }),
  serviceId: z.uuid({ error: 'Informe um serviço válido' }),
})

export function useRequestFormLogic({
  setOpenDialog,
  setCurrentAction,
  handleCloseDialog,
}: UseSignInLogicProps) {
  const { index } = useServiceServices()

  const [state, formAction, isLoading] = useActionState(createRequest, null)

  const [services, setServices] = useState<null | Service[]>(null)
  const [serviceId, setServiceId] = useState('')

  const navigate = useNavigate()

  async function fetchServices({ query = {} }: { query: IndexServiceQuery }) {
    try {
      const response = await index(query)

      setServices(response.data.services)
    } catch (error: any) {}
  }

  async function createRequest(_: any, formData: FormData) {
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      serviceId: formData.get('service'),
    }

    try {
      const parsedData = createRequestSchema.parse(data)

      await api.post('/requests', parsedData)

      setServiceId('')

      setCurrentAction({
        action: 'success',
        title: 'Chamado criado com sucesso',
        message:
          'Seu novo chamado já foi registrado, agora aguarde a resposta do técnico responsável. Clique em "Ok" para ir para seus chamados',
        handleAction: () => navigate('/requests'),
      })

      setOpenDialog(true)
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: CreateRequestFormErrors =
          z.flattenError(error).fieldErrors
        const formErrors: string[] = z.flattenError(error).formErrors

        return { data, fieldErrors, formErrors }
      }

      setServiceId('')

      setCurrentAction({
        action: 'failure',
        title: error.response.data.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)

      return { data }
    }
  }

  return {
    state,
    formAction,
    isLoading,
    services,
    serviceId,
    setServiceId,
    fetchServices,
  }
}
