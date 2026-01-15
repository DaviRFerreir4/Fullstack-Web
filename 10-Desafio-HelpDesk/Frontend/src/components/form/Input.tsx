import { InputWrapper } from './InputWrapper'

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
          type={type}
          {...rest}
        />
      </div>
    </InputWrapper>
  )
}
