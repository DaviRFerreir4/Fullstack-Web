// @ts-expect-error TS2307
import AlertIcon from '../../assets/icons/circle-alert.svg?react'

export interface IInputProps {
  label: string
  info?: boolean
  error?: boolean
  helperText?: string
}

type Props = IInputProps & {
  id?: string
  children: React.ReactNode
}

export function InputWrapper({
  label,
  info = false,
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
          ${info ? 'text-gray-400 italic' : 'text-feedback-danger'}
        `}
      >
        <AlertIcon className={`w-4 h-4 ${info && 'hidden'}`} />
        <span className="text-xs">{helperText}</span>
      </div>
    </div>
  )
}
