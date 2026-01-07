// @ts-expect-error TS2307
import QuestionIcon from '../assets/icons/circle-help.svg?react'
// @ts-expect-error TS2307
import ClockIcon from '../assets/icons/clock.svg?react'
// @ts-expect-error TS2307
import CheckIcon from '../assets/icons/circle-check-big.svg?react'
// @ts-expect-error TS2307
import BanIcon from '../assets/icons/ban.svg?react'

type Props = React.ComponentProps<'label'> & {
  status: keyof typeof statusData
}

const statusData = {
  opened: {
    text: 'Aberto',
    colors: 'text-feedback-open bg-feedback-open/20',
  },
  in_progress: {
    text: 'Em atendimento',
    colors: 'text-feedback-progress bg-feedback-progress/20',
  },
  closed: {
    text: 'Encerrado',
    colors: 'text-feedback-done bg-feedback-done/20',
  },
  active: {
    text: 'Ativo',
    colors: 'text-feedback-done bg-feedback-done/20',
  },
  inactive: {
    text: 'Inativo',
    colors: 'text-feedback-danger bg-feedback-danger/20',
  },
}

export function StatusTag({ status, className, ...rest }: Props) {
  return (
    <span
      className={`p-1.5 rounded-4xl flex w-fit items-center gap-1
        ${status === 'active' || status === 'inactive' ? 'lg:px-2.5' : ''}
        ${statusData[status].colors}
        ${className}
      `}
      {...rest}
    >
      {status === 'in_progress' ? (
        <ClockIcon className="w-4 h-4" />
      ) : status === 'closed' || status === 'active' ? (
        <CheckIcon
          className={`w-4 h-4 ${status === 'active' && 'lg:hidden'}`}
        />
      ) : status === 'inactive' ? (
        <BanIcon className="w-4 h-4 lg:hidden" />
      ) : (
        <QuestionIcon className="w-4 h-4" />
      )}
      <span className="hidden lg:block">{statusData[status].text}</span>
    </span>
  )
}
