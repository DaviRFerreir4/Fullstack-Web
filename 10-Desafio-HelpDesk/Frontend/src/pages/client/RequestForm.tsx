import { useEffect, useRef } from 'react'
import { Input } from '../../components/form/Input'
import { Select } from '../../components/form/Select'
import { Textarea } from '../../components/form/Textarea'
import { InfoField } from '../../components/InfoField'
import { Button } from '../../components/form/Button'
import { Dialog } from '../../components/dialogs/Dialog'
import { useResultDialog } from '../../hooks/useResultDialog'
import { useRequestFormLogic } from '../../hooks/pages/client/useRequestFormLogic'

export function RequestForm() {
  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  const {
    state,
    formAction,
    isLoading,
    services,
    serviceId,
    setServiceId,
    fetchServices,
  } = useRequestFormLogic({
    setCurrentAction,
    setOpenDialog,
    handleCloseDialog,
  })

  const selectRef = useRef<HTMLSelectElement | null>(null)

  useEffect(() => {
    fetchServices({ query: { is_active: true, perPage: -1 } })
  }, [])

  useEffect(() => {
    if (selectRef.current) {
      selectRef.current.value = state?.data.serviceId?.toString() ?? ''
    }
  }, [state])

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
              ref={selectRef}
              label="Categoria de serviço"
              name="service"
              id="service"
              options={
                services
                  ? services.map((service) => {
                      return { text: service.title, value: service.id }
                    })
                  : []
              }
              placeholder="Selecione a categoria de atendimento"
              defaultValue={serviceId}
              selectValue={serviceId}
              onChange={(event) => setServiceId(event.target.value)}
              error={!!state?.fieldErrors?.serviceId}
              helperText={
                state?.fieldErrors?.serviceId
                  ? state.fieldErrors.serviceId[0]
                  : undefined
              }
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
