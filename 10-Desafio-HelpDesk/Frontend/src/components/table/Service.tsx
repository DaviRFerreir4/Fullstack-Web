// @ts-expect-error TS2307
import EditIcon from '../../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import BanIcon from '../../assets/icons/ban.svg?react'

import { StatusTag } from '../StatusTag'
import { Button } from '../form/Button'
import { useIsMobile } from '../../hooks/useIsMobile'

type Props = {
  serviceData: {
    title: string
    value: number
    status: 'active' | 'inactive'
  }
}

export function Service({ serviceData }: Props) {
  const isMobile = useIsMobile()

  return (
    <tr className="h-16 text-gray-200">
      <td className="px-3 border-t border-gray-500 text-sm font-bold">
        <span className="line-clamp-1 wrap-anywhere">{serviceData.title}</span>
      </td>
      <td className="px-3 border-t border-gray-500 text-sm">
        <span className="line-clamp-1 wrap-anywhere">
          {serviceData.value.toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </td>
      <td className="px-3 border-t border-gray-500 text-xs">
        <div className="w-fit flex mx-auto">
          <StatusTag status={serviceData.status} />
        </div>
      </td>
      <td className="px-3 border-t border-gray-500 text-xs font-bold">
        <div className="flex justify-end gap-2">
          <Button
            Icon={BanIcon}
            {...(!isMobile && {
              text: serviceData.status === 'active' ? 'Desativar' : 'Reativar',
            })}
            variant="link"
            size="xs"
          />
          <Button Icon={EditIcon} variant="secondary" size="sm" />
        </div>
      </td>
    </tr>
  )
}
