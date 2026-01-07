import type { ComponentType } from 'react'

type Props = React.ComponentProps<'a'> & {
  Icon: ComponentType<{ className?: string }>
  text: string
  selected?: boolean
  colorClasses?: string
}

export function SubMenu({
  Icon,
  text,
  selected = false,
  colorClasses,
  ...rest
}: Props) {
  return (
    <a
      className={`p-3 rounded-md flex items-center gap-3
        ${selected ? 'bg-blue-dark text-gray-600' : 'hover:bg-gray-200'}
        ${colorClasses ? colorClasses : 'text-gray-400 hover:text-gray-500'}
      `}
      {...rest}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm">{text}</span>
    </a>
  )
}
