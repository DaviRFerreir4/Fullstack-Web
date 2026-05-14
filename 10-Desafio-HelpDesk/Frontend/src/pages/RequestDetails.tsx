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
import { useEffect } from 'react'
import { Dialog } from '../components/dialogs/Dialog'
import { useAuth } from '../hooks/useAuth'
import { useResultDialog } from '../hooks/useResultDialog'
import { RemoveRequestServiceDialog } from '../components/dialogs/pages/RequestDetails/RemoveRequestServiceDialog'
import { useRequestDetailsLogic } from '../hooks/pages/useRequestDetailsLogic'
import { EditRequestServiceDialog } from '../components/dialogs/pages/RequestDetails/EditRequestServiceDialog'

export function RequestDetails() {
  const { session } = useAuth()

  if (!session) return <div>User not logged in</div>

  const navigate = useNavigate()
  const params = useParams()
  const id = Number(params.id)

  const {
    dialogRef,
    openDialog,
    setOpenDialog,
    currentAction,
    setCurrentAction,
    handleCloseDialog,
  } = useResultDialog()

  if (isNaN(id) || id <= 0) return <div>Invalid Id</div>

  const {
    formAddIsLoading,
    isRmvServiceLoading,
    serviceName,
    setServiceName,
    serviceValue,
    setServiceValue,
    services,
    request,
    clearFields,
    fetchRequest,
    fetchServices,
    changeRequestStatus,
    serviceOperations,
    // useNewService,
    // useSelect,
    // formAddState,
    // isNewService,
    // setIsNewService,
    // serviceId,
    // setServiceId,
  } = useRequestDetailsLogic({
    requestId: id,
    navigate,
    setOpenDialog,
    setCurrentAction,
    handleCloseDialog,
  })

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
                  userId={request?.client?.id ?? ''}
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
                userId={request?.technician?.id ?? ''}
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
        isFormLoading={
          currentAction?.action === 'edit'
            ? formAddIsLoading
            : isRmvServiceLoading
        }
      >
        {currentAction?.action === 'edit' ? (
          <EditRequestServiceDialog
            clearFields={clearFields}
            services={services}
            fetchServices={fetchServices}
            serviceName={serviceName}
            setServiceName={setServiceName}
            serviceValue={serviceValue}
            // useNewService={useNewService}
            // useSelect={useSelect}
            // isNewService={isNewService}
            // setIsNewService={setIsNewService}
            // formAddState={formAddState}
            // serviceId={serviceId}
            // setServiceId={setServiceId}
          />
        ) : currentAction?.action === 'remove' ? (
          <RemoveRequestServiceDialog
            requestId={request?.id}
            serviceName={serviceName}
          />
        ) : (
          ''
        )}
      </Dialog>
    </div>
  )
}
