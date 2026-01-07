// @ts-expect-error TS2307
import EditIcon from '../../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import TrashIcon from '../../assets/icons/trash.svg?react'

import { ProfilePicture } from '../ProfilePicture'
import { Button } from '../form/Button'

type Props = {
  clientData: {
    name: string
    email: string
  }
  editClient: (client: {
    name: string
    email: string
    profilePicture?: string
  }) => undefined
}

export function Client({ clientData, editClient }: Props) {
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
          />
          <Button
            Icon={EditIcon}
            variant="secondary"
            size="sm"
            onClick={() =>
              editClient({
                name: clientData.name,
                email: clientData.email,
              })
            }
          />
        </div>
      </td>
    </tr>
  )
}
