type Props = React.ComponentProps<'div'> & {
  title: string
  spacing?: string
  children: React.ReactNode
}

export function InfoField({
  title,
  spacing = 'gap-0.5',
  children,
  className,
  ...rest
}: Props) {
  return (
    <div className={`grid ${spacing} ${className}`} {...rest}>
      <h3 className="mb-0.5 text-xs font-bold text-gray-400">{title}</h3>
      {children}
    </div>
  )
}
