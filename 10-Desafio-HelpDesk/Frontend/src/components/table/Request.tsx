// @ts-expect-error TS2307
import EditIcon from '../../assets/icons/pen-line.svg?react'

import { ProfilePicture } from '../ProfilePicture'
import { Button } from '../form/Button'
import { StatusTag } from '../StatusTag'

type Props = {
  requestData: {
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
}

export function Request({ requestData }: Props) {
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
      <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
        {Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(requestData.value)}
      </td>
      <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <ProfilePicture username={requestData.client.name} />
          {requestData.client.name}
        </div>
      </td>
      <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <ProfilePicture username={requestData.technician.name} />
          {requestData.technician.name}
        </div>
      </td>
      <td className="px-3 border-t border-gray-500 text-xs font-bold">
        <StatusTag status={requestData.status} className="mx-auto lg:mx-0" />
      </td>
      <td className="px-3 border-t border-gray-500">
        <div className="flex justify-end">
          <Button Icon={EditIcon} variant="secondary" size="sm" />
        </div>
      </td>
    </tr>
  )
}
