import type { ComponentType } from 'react'

type Props = React.ComponentProps<'button'> & {
  text?: string
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  Icon?: ComponentType<{ className?: string }>
}

const variants = {
  primary: 'bg-gray-200 text-gray-600 hover:bg-gray-100',
  secondary: 'bg-gray-500 text-gray-200 hover:bg-gray-400 hover:text-gray-100',
}

const sizes = {
  md: 'p-2.5',
  sm: 'p-1.5',
}

export function Button({
  text,
  variant = 'primary',
  size = 'md',
  Icon,
  ...rest
}: Props) {
  return (
    <button
      className={`rounded-md flex justify-center items-center gap-2 text-sm font-bold transition ${
        variants[variant]
      } ${sizes[size]} ${!Icon && 'w-full'}`}
      {...rest}
    >
      {Icon && (
        <Icon className={`${size === 'md' ? 'w-4.5 h-4.5' : 'w-3.5 h-3.5'}`} />
      )}
      {text}
    </button>
  )
}
