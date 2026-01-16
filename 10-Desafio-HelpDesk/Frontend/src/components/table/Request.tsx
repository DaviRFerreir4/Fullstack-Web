// @ts-expect-error TS2307
import EditIcon from '../../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import ShowIcon from '../../assets/icons/eye.svg?react'

import { ProfilePicture } from '../ProfilePicture'
import { Button } from '../form/Button'
import { StatusTag } from '../StatusTag'
import { useNavigate } from 'react-router'
import { useIsMobile } from '../../hooks/useIsMobile'
import { type Request } from '../../data/requests'
import { users } from '../../data/users'
import dayjs from 'dayjs'

export type IRequest = Pick<
  Request,
  'id' | 'title' | 'status' | 'client' | 'technician' | 'services' | 'updatedAt'
>

type Props = {
  requestData: IRequest
}

const user = users.find((user) => user.id === localStorage.getItem('userid'))
const userRole = user?.role

export function Request({ requestData }: Props) {
  if (!user) return

  const isMobile = useIsMobile()
  const navigate = useNavigate()

  requestData.services.sort((a, b) => {
    return dayjs(a.createdAt).diff(dayjs(b.createdAt))
  })

  return (
    <tr className="h-16 text-gray-200">
      <td className="px-3 border-t border-gray-500 text-xs">
        {dayjs(requestData.updatedAt).format('DD/MM/YYYY HH:mm')}
      </td>
      <td className="px-3 border-t border-gray-500 text-xs font-bold hidden lg:table-cell">
        {requestData.id.toLocaleString('pt-br', {
          minimumIntegerDigits: 5,
          useGrouping: false,
        })}
      </td>
      {userRole === 'client' ? (
        <>
          <td className="px-3 border-t border-gray-500">
            <h3
              className="text-sm font-bold line-clamp-1"
              title={requestData.title}
            >
              {requestData.title}
            </h3>
          </td>
          <td className="px-3 border-t border-gray-500 hidden lg:table-cell">
            <span
              className="text-sm line-clamp-1"
              title={requestData.services[0].service.title}
            >
              {requestData.services[0].service.title}
            </span>
          </td>
        </>
      ) : (
        <td className="px-3 border-t border-gray-500">
          <div className="grid">
            <h3
              className="text-sm font-bold line-clamp-1"
              title={requestData.title}
            >
              {requestData.title}
            </h3>
            <span
              className="text-xs line-clamp-1"
              title={requestData.services[0].service.title}
            >
              {requestData.services[0].service.title}
            </span>
          </div>
        </td>
      )}
      <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
        {requestData.services
          .map((service) => service.service.value)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
          .toLocaleString('pt-br', {
            minimumFractionDigits: 2,
          })}
      </td>
      {userRole !== 'client' && (
        <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
          <div className="flex items-center gap-2">
            <ProfilePicture
              username={requestData.client.name}
              profilePicture={requestData.client.profilePicture}
            />
            <span className="line-clamp-1">{requestData.client.name}</span>
          </div>
        </td>
      )}
      <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <ProfilePicture
            username={requestData.technician.name}
            profilePicture={requestData.technician.profilePicture}
          />
          <span className="line-clamp-1">{requestData.technician.name}</span>
        </div>
      </td>
      <td className="px-3 border-t border-gray-500 text-xs font-bold">
        <StatusTag
          status={requestData.status}
          includeText={!isMobile}
          className="mx-auto lg:mx-0"
        />
      </td>
      <td className="px-3 border-t border-gray-500">
        <div className="flex justify-end">
          <Button
            Icon={userRole === 'client' ? ShowIcon : EditIcon}
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/requests/${requestData.id}`)}
          />
        </div>
      </td>
    </tr>
  )
}
