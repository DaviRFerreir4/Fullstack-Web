// @ts-expect-error TS2307
import AlertIcon from '../../assets/icons/circle-alert.svg?react'

export interface IInputProps {
  label: string
  error?: boolean
  helperText?: string
}

type Props = IInputProps & {
  id?: string
  children: React.ReactNode
}

export function InputWrapper({
  label,
  error = false,
  helperText = '',
  id,
  children,
}: Props) {
  return (
    <div className="group grid gap-2 text-gray-300 focus-within:text-blue-base">
      <label htmlFor={id} className="text-xxs uppercase font-bold">
        {label}
      </label>
      {children}
      <div
        className={`items-center gap-1
          ${helperText ? 'flex' : 'hidden'}
          ${error ? 'text-feedback-danger' : 'text-gray-400 italic'}
        `}
      >
        <AlertIcon
          className={`w-4 h-4 flex-[0_0_auto] self-baseline ${!error && 'hidden'}`}
        />
        <span className="text-xs">{helperText}</span>
      </div>
    </div>
  )
}
