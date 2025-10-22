import { classMerge } from '../utils/classMerge'

type Props = React.ComponentProps<'button'> & {
  isLoading?: boolean
  variant?: 'default' | 'icon'
}

const variants = {
  button: {
    default: 'h-12',
    icon: 'h-12 w-12',
  },
}

export function Button({
  children,
  isLoading,
  variant = 'default',
  type = 'button',
  className,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={classMerge(
        [
          'flex items-center justify-center bg-green-100 rounded-lg text-white cursor-pointer hover:bg-green-200 transition ease-linear disabled:opacity-50 disabled:cursor-progress',
        ],
        variants.button[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
