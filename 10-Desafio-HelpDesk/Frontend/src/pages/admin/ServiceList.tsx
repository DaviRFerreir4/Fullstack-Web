// @ts-expect-error TS2307
import PlusIcon from '../../assets/icons/plus.svg?react'

import { Button } from '../../components/form/Button'
import { TableHeader } from '../../components/table/TableHeader'
import { Service } from '../../components/table/Service'
import { useIsMobile } from '../../hooks/useIsMobile'

export function ServiceList() {
  const isMobile = useIsMobile()

  return (
    <div>
      <div className="flex justify-between items-center mb-4 lg:mb-6">
        <h1 className="text-lg lg:text-xl font-bold text-blue-dark">
          Técnicos
        </h1>
        <Button
          text={isMobile ? undefined : 'Novo'}
          Icon={PlusIcon}
          size="custom"
          className="px-4 py-2.5 h-10"
        />
      </div>
      <table className="w-full border border-gray-500 rounded-xl border-separate table-fixed">
        <thead>
          <tr>
            <TableHeader text="Título" />
            <TableHeader text="Valor" />
            <TableHeader text="Status" className="w-16 lg:w-20.5" textCenter />
            <TableHeader text="" className="w-19 lg:w-36" />
          </tr>
        </thead>
        <tbody>
          <Service
            serviceData={{
              title: 'Instalação de Rede',
              value: 180,
              status: 'active',
            }}
          />
          <Service
            serviceData={{
              title: 'Recuperação de Dados',
              value: 200,
              status: 'inactive',
            }}
          />
          <Service
            serviceData={{
              title: 'Manutenção de Hardware',
              value: 150,
              status: 'active',
            }}
          />
          <Service
            serviceData={{
              title: 'Suporte de Software',
              value: 200,
              status: 'active',
            }}
          />
        </tbody>
      </table>
    </div>
  )
}
