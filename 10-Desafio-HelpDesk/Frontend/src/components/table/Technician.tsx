import { useEffect, useRef, useState } from 'react'

// @ts-expect-error TS2307
import EditIcon from '../../assets/icons/pen-line.svg?react'
// @ts-expect-error TS2307
import TrashIcon from '../../assets/icons/trash.svg?react'

import { ProfilePicture } from '../ProfilePicture'
import { TimeTag } from '../TimeTag'
import { Button } from '../form/Button'

export interface ITechnician {
  name: string
  email: string
  availability: number[]
  profilePicture?: string
}

export interface ITechnicianAction {
  action: 'remove'
  title: string
}

type Props = {
  technicianData: ITechnician
  technicianOperations: (
    technician: ITechnician,
    technicianAction: ITechnicianAction
  ) => void
}

export function Technician({ technicianData, technicianOperations }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [maxVisible, setMaxVisible] = useState(
    technicianData.availability.length
  )

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver(() => {
      if (!containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const chipWidth = 62

      const excessChipWidth = 38.25

      const availableWidthWithExcessChip = containerWidth - excessChipWidth

      const fitCountWithoutExcessChip = Math.floor(containerWidth / chipWidth)
      const fitCountWithExcessChip = Math.floor(
        availableWidthWithExcessChip / chipWidth
      )

      if (fitCountWithoutExcessChip >= maxVisible) {
        setMaxVisible(fitCountWithoutExcessChip)
      } else {
        setMaxVisible(fitCountWithExcessChip)
      }
    })

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [technicianData.availability])

  const visibleHours = technicianData.availability.slice(0, maxVisible)
  const hiddenHours = technicianData.availability.length - visibleHours.length

  return (
    <tr className="h-16 text-gray-200">
      <td className="px-3 border-t border-gray-500 text-sm font-bold">
        <div className="flex items-center gap-2">
          <ProfilePicture username={technicianData.name} />
          <span className="line-clamp-1">{technicianData.name}</span>
        </div>
      </td>
      <td className="px-3 border-t border-gray-500 text-sm hidden lg:table-cell">
        {technicianData.email}
      </td>
      <td className="px-3 border-t border-gray-500 text-xs font-bold">
        <div
          className="flex gap-1 overflow-hidden lg:max-w-78 min-w-25.5"
          ref={containerRef}
        >
          {visibleHours.map((hour) => {
            return <TimeTag hour={hour} disabled />
          })}
          {hiddenHours > 0 && <TimeTag excess={hiddenHours} disabled />}
        </div>
      </td>
      <td className="px-3 border-t border-gray-500 text-xs font-bold">
        <div className="flex justify-end gap-2">
          <Button
            Icon={TrashIcon}
            variant="secondary"
            size="sm"
            iconColor="text-feedback-danger"
            onClick={() =>
              technicianOperations(technicianData, {
                action: 'remove',
                title: 'Excluir Técnico',
              })
            }
          />
          <Button Icon={EditIcon} variant="secondary" size="sm" />
        </div>
      </td>
    </tr>
  )
}
