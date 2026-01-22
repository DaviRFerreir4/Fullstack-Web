// @ts-expect-error TS2307
import OpenEyeIcon from '../../assets/icons/eye.svg?react'
// @ts-expect-error TS2307
import ClosedEyeIcon from '../../assets/icons/eye-closed.svg?react'

import { InputWrapper } from './InputWrapper'
import { type IInputProps } from './InputWrapper'
import { useState } from 'react'

type Props = React.ComponentProps<'input'> &
  IInputProps & {
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
  const [showPassword, setShowPassword] = useState(false)

  return (
    <InputWrapper
      label={label}
      error={error}
      info={info}
      helperText={helperText}
      id={id}
    >
      <div className="relative">
        {currency && <span className="absolute font-bold">R$</span>}
        <input
          id={id}
          className={`w-full pb-2 border-b border-gray-500 text-gray-200 placeholder:text-gray-400 focus-within:outline-0 focus:border-blue-base hover:border-blue-base disabled:hover:border-gray-500
            ${currency && 'pl-6'}
          `}
          type={type === 'password' && showPassword ? 'text' : type}
          {...rest}
        />
        {type === 'password' && (
          <div className="absolute top-1/6 right-4 translate-x-1/2 cursor-pointer">
            {showPassword ? (
              <ClosedEyeIcon
                className="w-4 h-4"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <OpenEyeIcon
                className="w-4 h-4"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        )}
      </div>
    </InputWrapper>
  )
}
