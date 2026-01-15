import { InputWrapper } from './InputWrapper'

type Props = React.ComponentProps<'textarea'> & {
  label: string
  info?: boolean
  error?: boolean
  helperText?: string
}

export function Textarea({
  label,
  info = false,
  error = false,
  helperText = '',
  id,
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
      <textarea
        id={id}
        className="w-full h-auto pb-2 border-b border-gray-500 text-gray-200 resize-none placeholder:text-gray-400 focus-within:outline-0 focus:border-blue-base hover:border-blue-base disabled:hover:border-gray-500"
        {...rest}
      />
    </InputWrapper>
  )
}
