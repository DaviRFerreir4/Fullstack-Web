// @ts-expect-error TS2307
import EditIcon from '../../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import ShowIcon from '../../assets/icons/eye.svg?react'

import { ProfilePicture } from '../ProfilePicture'
import { Button } from '../form/Button'
import { StatusTag } from '../StatusTag'
import { useNavigate } from 'react-router'
import { useIsMobile } from '../../hooks/useIsMobile'
import { users } from '../../data/users'

export interface IRequest {
  date: string
  id: number
  text: {
    title: string
    service: string
  }
  value: number
  client: {
    name: string
  }
  technician: {
    name: string
  }
  status: 'opened' | 'in_progress' | 'closed'
}

type Props = {
  requestData: IRequest
}

const user = users.find((user) => user.id === localStorage.getItem('userid'))
const userRole = user?.role

export function Request({ requestData }: Props) {
  if (!user) return

  const isMobile = useIsMobile()
  const navigate = useNavigate()

  return (
    <tr className="h-16 text-gray-200">
      <td className="px-3 border-t border-gray-500 text-xs">
        {requestData.date}
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
              title={requestData.text.title}
            >
              {requestData.text.title}
            </h3>
          </td>
          <td className="px-3 border-t border-gray-500 hidden lg:table-cell">
            <span
              className="text-sm line-clamp-1"
              title={requestData.text.service}
            >
              {requestData.text.service}
            </span>
          </td>
        </>
      ) : (
        <td className="px-3 border-t border-gray-500">
          <div className="grid">
            <h3
              className="text-sm font-bold line-clamp-1"
              title={requestData.text.title}
            >
              {requestData.text.title}
            </h3>
            <span
              className="text-xs line-clamp-1"
              title={requestData.text.service}
            >
              {requestData.text.service}
            </span>
          </div>
        </td>
      )}
      <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
        {Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(requestData.value)}
      </td>
      {userRole !== 'client' && (
        <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
          <div className="flex items-center gap-2">
            <ProfilePicture username={requestData.client.name} />
            <span className="line-clamp-1">{requestData.client.name}</span>
          </div>
        </td>
      )}
      <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <ProfilePicture username={requestData.technician.name} />
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
