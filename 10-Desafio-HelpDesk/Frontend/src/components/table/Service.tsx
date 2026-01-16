// @ts-expect-error TS2307
import EditIcon from '../../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import BanIcon from '../../assets/icons/ban.svg?react'

import { StatusTag } from '../StatusTag'
import { Button } from '../form/Button'
import { useIsMobile } from '../../hooks/useIsMobile'
import { type Service } from '../../data/services'

export type IService = Pick<Service, 'id' | 'title' | 'isActive'> & {
  value: string
}

export interface IServiceAction {
  action: 'create' | 'edit' | 'disable' | 'enable'
  title: string
}

type Props = {
  serviceData: IService
  serviceOperations: (service: IService, serviceAction: IServiceAction) => void
}

export function Service({ serviceData, serviceOperations }: Props) {
  const isMobile = useIsMobile()

  return (
    <tr className="h-16 text-gray-200">
      <td className="px-3 border-t border-gray-500 text-sm font-bold">
        <span className="line-clamp-1 wrap-anywhere">{serviceData.title}</span>
      </td>
      <td className="px-3 border-t border-gray-500 text-sm">
        <span className="line-clamp-1 wrap-anywhere">
          {Number(serviceData.value).toLocaleString('pt-br', {
            minimumFractionDigits: 2,
            style: 'currency',
            currency: 'BRL',
          })}
        </span>
      </td>
      <td className="px-3 border-t border-gray-500 text-xs">
        <div className="w-fit flex mx-auto">
          <StatusTag
            status={serviceData.isActive ? 'active' : 'inactive'}
            includeText={!isMobile}
          />
        </div>
      </td>
      <td className="px-3 border-t border-gray-500 text-xs font-bold">
        <div className="flex justify-end gap-2">
          <Button
            Icon={BanIcon}
            {...(!isMobile && {
              text: serviceData.isActive ? 'Desativar' : 'Reativar',
            })}
            variant="link"
            size="xs"
            onClick={() =>
              serviceOperations(serviceData, {
                action: serviceData.isActive ? 'disable' : 'enable',
                title: serviceData.isActive
                  ? 'Desativar serviço'
                  : 'Ativar serviço',
              })
            }
          />
          <Button
            Icon={EditIcon}
            variant="secondary"
            size="sm"
            onClick={() =>
              serviceOperations(serviceData, {
                action: 'edit',
                title: 'Serviço',
              })
            }
          />
        </div>
      </td>
    </tr>
  )
}
