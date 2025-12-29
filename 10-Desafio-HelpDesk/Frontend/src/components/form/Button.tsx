type Props = React.ComponentProps<'button'> & {
  text: string
  variant?: keyof typeof variants
}

const variants = {
  primary: 'bg-gray-200 text-gray-600',
  secondary: 'bg-gray-500 text-gray-200',
}

export function Button({ text, variant = 'primary', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`py-2.5 rounded-md text-sm font-bold ${variants[variant]}`}
    >
      {text}
    </button>
  )
}
