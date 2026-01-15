// @ts-expect-error TS2307
import ArrowIcon from '../../assets/icons/chevron-down.svg?react'

import { InputWrapper } from './InputWrapper'
import { useState } from 'react'

type Props = React.ComponentProps<'select'> & {
  label: string
  info?: boolean
  error?: boolean
  helperText?: string
  options: { text: string; value: string }[]
  placeholder: string
  saveValue: (value: string) => void
}

export function Select({
  label,
  info = false,
  error = false,
  helperText = '',
  placeholder,
  id,
  options,
  saveValue,
  ...rest
}: Props) {
  const [selectColor, setSelectColor] = useState('text-gray-400')

  return (
    <InputWrapper
      label={label}
      error={error}
      info={info}
      helperText={helperText}
      id={id}
    >
      <div className="relative group">
        <ArrowIcon className="w-4 h-4 absolute top-1/6 right-2 translate-x-1/2 group-has-open:rotate-180 transition-transform" />
        <select
          id={id}
          {...rest}
          className={`appearance-none w-full pb-2 border-b border-gray-500 outline-none focus:border-blue-base hover:border-blue-base ${selectColor}`}
          defaultValue=""
          onChange={(event) => {
            setSelectColor(
              event.target.value === '' ? 'text-gray-400' : 'text-gray-200'
            )
            saveValue(event.target.value)
          }}
        >
          <option value="" hidden disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    </InputWrapper>
  )
}
