import alertSvg from '../../assets/icons/circle-alert.svg'

type Props = React.ComponentProps<'input'> & {
  label: string
  error?: boolean
}

export function Input({
  label,
  error = false,
  id,
  type = 'text',
  ...rest
}: Props) {
  return (
    <div className="grid gap-2 text-gray-300 focus-within:text-blue-base">
      <label htmlFor={id} className="text-xxs uppercase font-bold">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className="pb-2 border-b border-gray-500 text-gray-200 placeholder:text-gray-400 focus-within:outline-0 focus:border-blue-base"
      />
      <div className={`items-center gap-1 ${error ? 'flex' : 'hidden'}`}>
        <img src={alertSvg} className="w-4 h-4" />
        <span className="text-xs text-feedback-danger">teste</span>
      </div>
    </div>
  )
}
