type Props = React.ComponentProps<'a'>

export function Link({ children, ...rest }: Props) {
  return (
    <a
      className="text-sm font-medium text-gray-100 mt-8 hover:text-green-800 transition ease-linear w-fit"
      {...rest}
    >
      {children}
    </a>
  )
}
