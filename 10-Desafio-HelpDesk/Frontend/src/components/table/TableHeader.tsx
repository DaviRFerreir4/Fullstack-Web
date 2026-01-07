type Props = React.ComponentProps<'th'> & {
  text: string
  desktopOnly?: boolean
  textCenter?: boolean
}

export function TableHeader({
  text,
  desktopOnly,
  textCenter,
  className,
  ...rest
}: Props) {
  return (
    <th
      className={`px-3 border-y-14 border-transparent text-sm font-bold lg:table-cell text-gray-400
        ${desktopOnly && 'hidden'}
        ${className}
      `}
      {...rest}
    >
      <span className={`w-fit line-clamp-1 ${textCenter && 'mx-auto'}`}>
        {text}
      </span>
    </th>
  )
}
