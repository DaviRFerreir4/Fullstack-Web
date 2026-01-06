// @ts-expect-error TS2307
import PlusIcon from '../../assets/icons/plus.svg?react'

import { Button } from '../../components/form/Button'
import { TableHeader } from '../../components/table/TableHeader'
import { Technician } from '../../components/table/Technician'
import { useIsMobile } from '../../hooks/useIsMobile'

export function TechnicianList() {
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
      <table className="w-full border border-gray-500 rounded-xl border-separate">
        <thead>
          <tr>
            <TableHeader text="Nome" />
            <TableHeader text="E-mail" desktopOnly />
            <TableHeader text="Disponibilidade" />
            <TableHeader text="" />
          </tr>
        </thead>
        <tbody>
          <Technician
            technicianData={{
              name: 'Carlo Silva',
              email: 'carlos.silva@email.com',
              availability: [8, 9, 10, 11, 13, 14, 15, 16],
            }}
          />
          <Technician
            technicianData={{
              name: 'Ana Oliveira',
              email: 'ana.oliveira@test.com',
              availability: [13, 14, 15, 16],
            }}
          />
          <Technician
            technicianData={{
              name: 'Cíntia Lúcia',
              email: 'cintia.lucia@test.com',
              availability: [8, 9, 14, 15, 18],
            }}
          />
          <Technician
            technicianData={{
              name: 'Marcos Alves',
              email: 'marcos.alves@test.com',
              availability: [7, 9, 11, 15, 17, 19, 20],
            }}
          />
        </tbody>
      </table>
    </div>
  )
}
