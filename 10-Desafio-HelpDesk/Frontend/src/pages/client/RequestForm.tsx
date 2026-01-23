import { useActionState, useEffect, useState } from 'react'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Textarea } from '../../components/form/Textarea'
import { InfoField } from '../../components/InfoField'
import { Button } from '../../components/form/Button'
import { api } from '../../services/api'
import z, { ZodError } from 'zod'
import { useNavigate } from 'react-router'
import { Dialog } from '../../components/Dialog'
import { useResultDialog } from '../../hooks/useResultDialog'

const createRequestSchema = z.object({
  title: z
    .string({ error: 'Informe o título' })
    .min(8, { error: 'O título deve conter ao menos 8 digitos' }),
  description: z
    .string({ error: 'Informe a descrição' })
    .min(12, { error: 'A descrição deve conter ao menos 12 digitos' }),
  serviceId: z.uuid({ error: 'Informe um serviço válido' }),
})

export function RequestForm() {
  const [services, setServices] = useState<null | Service[]>(null)
  const [serviceId, setServiceId] = useState('')

  const [state, formAction, isLoading] = useActionState(createRequest, null)

  const navigate = useNavigate()

  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  async function fetchServices() {
    try {
      const servicesResponse =
        await api.get<IndexServiceAPIResponse>('/services')

      setServices(servicesResponse.data.services)
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

      setCurrentAction({
        action: 'success',
        title: 'Chamado criado com sucesso',
        handleAction: () => navigate('/requests'),
      })

      setOpenDialog(true)

      setServiceId('')

      const select = document.querySelector('select')

      if (select) {
        select.value = ''
      }
    } catch (error: any) {
      if (error instanceof ZodError) {
        const fieldErrors: createRequestFormErrors =
          z.flattenError(error).fieldErrors
        const formErrors: string[] = z.flattenError(error).formErrors

        setServiceId(data.serviceId?.toString() ?? '')

        return { data, fieldErrors, formErrors }
      }

      setCurrentAction({
        action: 'failure',
        title: error.response.data.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)

      return { data }
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    const select = document.querySelector('select')
    if (select) {
      select.value = state?.data.serviceId?.toString() ?? ''
    }
  }, [state?.data.serviceId])

  return (
    <div className="lg:mx-35.5 grid gap-4 lg:gap-6 text-gray-200">
      <h1 className="text-lg lg:text-xl font-bold text-blue-dark">
        Novo chamado
      </h1>
      <form
        action={formAction}
        className="grid lg:items-start lg:grid-cols-[3fr_2fr] gap-4 lg:gap-6"
      >
        <div className="p-5 lg:p-8 border border-gray-500 rounded-[0.625rem] grid gap-6">
          <div>
            <h2 className="font-bold ">Informações</h2>
            <p className="text-xs text-gray-300">
              Descreva as informações do seu problema
            </p>
          </div>
          <div className="grid gap-4">
            <Input
              label="Título"
              name="title"
              id="title"
              placeholder="Digite um título para o chamado"
              error={!!state?.fieldErrors?.title}
              helperText={
                state?.fieldErrors?.title
                  ? state.fieldErrors.title[0]
                  : undefined
              }
              defaultValue={
                state?.data.title ? state?.data.title?.toString() : undefined
              }
              required
            />
            <Textarea
              label="Descrição"
              name="description"
              id="description"
              rows={6}
              placeholder="Descreva o que está acontecendo"
              error={!!state?.fieldErrors?.description}
              helperText={
                state?.fieldErrors?.description
                  ? state.fieldErrors.description[0]
                  : undefined
              }
              defaultValue={
                state?.data.description
                  ? state?.data.description?.toString()
                  : ''
              }
              required
            />
            <Select
              label="Categoria de serviço"
              name="service"
              id="service"
              options={
                services
                  ? services
                      .filter((service) => service.isActive)
                      .map((service) => {
                        return { text: service.title, value: service.id }
                      })
                  : []
              }
              placeholder="Selecione a categoria de atendimento"
              onChange={(event) => setServiceId(event.target.value)}
              error={!!state?.fieldErrors?.serviceId}
              helperText={
                state?.fieldErrors?.serviceId
                  ? state.fieldErrors.serviceId[0]
                  : undefined
              }
              defaultValue={serviceId}
              required
            />
          </div>
        </div>
        <div className="p-5 lg:p-6 border border-gray-500 rounded-[0.625rem] grid gap-6">
          <div>
            <h2 className="font-bold">Resumo</h2>
            <p className="text-xs text-gray-300">Valores e detalhes</p>
          </div>
          {serviceId !== '' && (
            <>
              <InfoField title="Categoria de serviço">
                <span className="text-sm">
                  {services
                    ? services.find((service) => service.id === serviceId)
                        ?.title
                    : ''}
                </span>
              </InfoField>
              <InfoField title="Custo inicial">
                <div className="font-bold">
                  <small className="text-xs mr-1">R$</small>
                  <span className="text-lg">
                    {services
                      ? services
                          .find((service) => service.id === serviceId)
                          ?.value.toLocaleString('pt-br', {
                            minimumFractionDigits: 2,
                          })
                      : ''}
                  </span>
                </div>
              </InfoField>
            </>
          )}
          <p className="text-xs text-gray-300">
            O chamado será automaticamente atribuído a um técnico disponível
          </p>
          <Button text="Criar chamado" disabled={isLoading} />
        </div>
      </form>
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
