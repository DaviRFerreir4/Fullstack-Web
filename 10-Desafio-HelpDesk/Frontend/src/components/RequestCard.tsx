// @ts-expect-error TS2307
import EditIcon from '../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import CheckIcon from '../assets/icons/circle-check-big.svg?react'

import { Button } from './form/Button'
import { ProfilePicture } from './ProfilePicture'
import { StatusTag } from './StatusTag'

import { type Request } from '../data/requests'
import dayjs from 'dayjs'

type Props = {
  request: Request
  className?: string
}

export function RequestCard({ request, className }: Props) {
  return (
    <div
      className={`flex-[1_0_100%] lg:flex-none lg:w-86.5 p-5 border border-gray-500 rounded-[0.625rem] text-gray-200 ${className}`}
    >
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-400">
          {request.id.toLocaleString('pt-br', {
            minimumIntegerDigits: 5,
            useGrouping: false,
          })}
        </span>
        <div className="flex gap-2">
          <Button
            Icon={EditIcon}
            variant="secondary"
            size="custom"
            className="p-2"
          />
          {request.status !== 'closed' && (
            <Button
              Icon={CheckIcon}
              text={request.status === 'opened' ? 'Iniciar' : 'Encerrar'}
              size="sm"
            />
          )}
        </div>
      </div>
      <div className="grid gap-4">
        <div>
          <h2 className="font-bold text-gray-100">{request.title}</h2>
          <span className="h-fit block text-xs text-gray-200">
            {
              request.services.sort((a, b) => {
                return dayjs(a.createdAt).diff(dayjs(b.createdAt))
              })[0].service.title
            }
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs">
            {dayjs(request.updatedAt).format('DD/MM/YY HH:mm')}
          </span>
          <span className="text-sm">
            <small className="text-xxs">R$ </small>
            {request.services
              .map((service) => service.service.value)
              .reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
              )
              .toLocaleString('pt-br', {
                minimumFractionDigits: 2,
              })}
          </span>
        </div>
        <hr className="border-t border-gray-500" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <ProfilePicture username={request.client.name} />
            <span>{request.client.name}</span>
          </div>
          <StatusTag status={request.status} includeText={false} />
        </div>
      </div>
    </div>
  )
}
