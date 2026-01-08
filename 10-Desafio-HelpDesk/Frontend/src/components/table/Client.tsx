// @ts-expect-error TS2307
import EditIcon from '../../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import TrashIcon from '../../assets/icons/trash.svg?react'

import { ProfilePicture } from '../ProfilePicture'
import { Button } from '../form/Button'

export interface IClient {
  name: string
  email: string
  profilePicture?: string
}

export interface IClientAction {
  action: 'edit' | 'remove'
  title: string
}

type Props = {
  clientData: IClient
  clientOperations: (client: IClient, clientAction: IClientAction) => void
}

export function Client({ clientData, clientOperations }: Props) {
  return (
    <tr className="h-16 text-gray-200">
      <td className="px-3 border-t border-gray-500 text-sm font-bold">
        <div className="flex items-center gap-2">
          <ProfilePicture username={clientData.name} />
          <span className="line-clamp-1">{clientData.name}</span>
        </div>
      </td>
      <td className="px-3 border-t border-gray-500 text-sm">
        <span className="line-clamp-1 wrap-anywhere">{clientData.email}</span>
      </td>
      <td className="px-3 border-t border-gray-500 text-xs font-bold">
        <div className="flex justify-end gap-2">
          <Button
            Icon={TrashIcon}
            variant="secondary"
            size="sm"
            iconColor="text-feedback-danger"
            onClick={() =>
              clientOperations(
                {
                  name: clientData.name,
                  email: clientData.email,
                },
                { action: 'remove', title: 'Excluir cliente' }
              )
            }
          />
          <Button
            Icon={EditIcon}
            variant="secondary"
            size="sm"
            onClick={() =>
              clientOperations(
                {
                  name: clientData.name,
                  email: clientData.email,
                },
                { action: 'edit', title: 'Cliente' }
              )
            }
          />
        </div>
      </td>
    </tr>
  )
}
