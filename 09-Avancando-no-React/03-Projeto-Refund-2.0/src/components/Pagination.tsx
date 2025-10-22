import leftIconSvg from '../assets/left.svg'
import rightIconSvg from '../assets/right.svg'

import { Button } from './Button'

type Props = {
  current: number
  total: number
}

export function Pagination({ current, total }: Props) {
  return (
    <div className="flex flex-1 justify-center items-center gap-2.5">
      <Button variant="iconSmall">
        <img src={leftIconSvg} alt="Icone para voltar" />
      </Button>

      <span className="text-sm text-gray-200">{`${current}/${total}`}</span>

      <Button variant="iconSmall">
        <img src={rightIconSvg} alt="Icone para avançar" />
      </Button>
    </div>
  )
}
