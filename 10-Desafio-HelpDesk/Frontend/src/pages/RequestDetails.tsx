import { useNavigate, useParams } from 'react-router'
import { requests } from '../data/requests'

import { Button } from '../components/form/Button'
import { StatusTag } from '../components/StatusTag'
import { InfoField } from '../components/InfoField'
import { ProfilePicture } from '../components/ProfilePicture'

// @ts-expect-error TS2307
import BackIcon from '../assets/icons/arrow-left.svg?react'
// @ts-expect-error TS2307
import ClockIcon from '../assets/icons/clock.svg?react'
// @ts-expect-error TS2307
import DoneIcon from '../assets/icons/circle-check-big.svg?react'
import dayjs from 'dayjs'

export function RequestDetails() {
  const navigate = useNavigate()
  const params = useParams()

  const request = requests.find((request) => request.id === Number(params.id))

  if (!request) return

  request.services.sort((a, b) => {
    return dayjs(a.createdAt).diff(dayjs(b.createdAt))
  })

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
        <div className="flex gap-2">
          <Button
            Icon={ClockIcon}
            text="Em atendimento"
            variant="secondary"
            size="custom"
            className="w-full lg:w-auto lg:px-4 py-2.5 whitespace-nowrap"
          />
          <Button
            Icon={DoneIcon}
            text="Encerrado"
            variant="secondary"
            size="custom"
            className="w-full lg:w-auto lg:px-4 py-2.5"
          />
        </div>
      </div>
      <div className="lg:flex lg:items-start lg:gap-6">
        <div className="p-5 border border-gray-500 rounded-[0.625rem] grid gap-5 lg:flex-3">
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
        <div className="p-5 border border-gray-500 rounded-[0.625rem] grid gap-8 lg:flex-2">
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
                .map((service) => (
                  <div className="flex justify-between text-xs">
                    <span>{service.service.title}</span>
                    <span>
                      {service.service.value.toLocaleString('pt-br', {
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
                  .map((service) => service.service.value)
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
      </div>
    </div>
  )
}
