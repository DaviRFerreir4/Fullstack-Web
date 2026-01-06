type Props = React.ComponentProps<'th'> & {
  text: string
  desktopOnly?: boolean
}

export function TableHeader({ text, desktopOnly, ...rest }: Props) {
  return (
    <th
      className={`px-3 border-y-14 border-transparent text-sm font-bold text-start lg:table-cell text-gray-400 ${
        desktopOnly && 'hidden'
      }`}
      {...rest}
    >
      <span className="line-clamp-1">{text}</span>
    </th>
  )
}
