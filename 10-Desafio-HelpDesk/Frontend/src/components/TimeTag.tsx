// @ts-expect-error TS2307
import CloseIcon from '../assets/icons/close.svg?react'

type Props = React.ComponentProps<'input'> & {
  hour?: number
  excess?: number
}

export function TimeTag({ hour, excess, disabled, checked, ...rest }: Props) {
  return (
    <div
      className={`px-2.5 py-1.5 border rounded-4xl flex items-center gap-0.5 relative text-xs font-bold transition
        ${
          disabled
            ? 'border-gray-500 text-gray-400'
            : checked
            ? 'border-blue-base text-gray-600 bg-blue-base'
            : 'border-gray-400 text-gray-200 hover:bg-gray-500'
        }
      `}
    >
      <span className="whitespace-nowrap">{`${
        excess
          ? `+ ${excess}`
          : `${hour?.toLocaleString('pt-br', { minimumIntegerDigits: 2 })}:00`
      }`}</span>
      <CloseIcon className={`w-3.5 h-3.5 ${checked ? 'block' : 'hidden'}`} />
      <input
        type="checkbox"
        className="absolute inset-0 appearance-none"
        disabled={disabled}
        value={hour}
        checked={checked}
        {...rest}
      />
    </div>
  )
}
