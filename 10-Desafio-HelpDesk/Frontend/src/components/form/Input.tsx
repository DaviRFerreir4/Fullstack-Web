// @ts-expect-error TS2307
import AlertIcon from '../../assets/icons/circle-alert.svg?react'

type Props = React.ComponentProps<'input'> & {
  label: string
  info?: boolean
  error?: boolean
  helperText?: string
  currency?: boolean
}

export function Input({
  label,
  info = false,
  error = false,
  helperText = '',
  currency,
  id,
  type = 'text',
  ...rest
}: Props) {
  return (
    <div className="grid gap-2 text-gray-300 focus-within:text-blue-base">
      <label htmlFor={id} className="text-xxs uppercase font-bold">
        {label}
      </label>
      <div className="relative">
        {currency && <span className="absolute font-bold">R$</span>}
        <input
          id={id}
          className={`w-full pb-2 border-b border-gray-500 text-gray-200 placeholder:text-gray-400 focus-within:outline-0 focus:border-blue-base hover:border-blue-base
            ${currency && 'pl-6'}
          `}
          {...rest}
        />
      </div>
      <div
        className={`items-center gap-1
          ${info || error ? 'flex' : 'hidden'}
          ${info ? 'text-gray-400 italic' : 'text-feedback-danger'}
        `}
      >
        <AlertIcon className={`w-4 h-4 ${info && 'hidden'}`} />
        <span className="text-xs">{helperText}</span>
      </div>
    </div>
  )
}
