// @ts-expect-error TS2307
import ArrowIcon from '../../assets/icons/chevron-down.svg?react'

import { InputWrapper } from './InputWrapper'
import { type IInputProps } from './InputWrapper'

type Props = React.ComponentProps<'select'> &
  IInputProps & {
    options: { text: string; value: string }[]
    placeholder: string
    selectValue?: string
  }

export function Select({
  label,
  error = false,
  helperText = '',
  placeholder,
  id,
  options,
  selectValue,
  ...rest
}: Props) {
  return (
    <InputWrapper label={label} error={error} helperText={helperText} id={id}>
      <div className="relative group">
        <ArrowIcon className="w-4 h-4 absolute top-1/6 right-2 translate-x-1/2 group-has-open:rotate-180 transition-transform" />
        <select
          id={id}
          {...rest}
          className={`appearance-none w-full pb-2 border-b border-gray-500 outline-none focus:border-blue-base hover:border-blue-base ${selectValue !== '' ? 'text-gray-200' : 'text-gray-400'}`}
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
