type Props = React.ComponentProps<'input'> & {
  hour?: number
  excess?: number
}

export function TimeTag({ hour, excess, ...rest }: Props) {
  return (
    <div className="px-2.5 py-1.5 border border-gray-500 rounded-4xl flex relative text-gray-400">
      <span className="whitespace-nowrap">{`${
        excess
          ? `+ ${excess}`
          : `${hour?.toLocaleString('pt-br', { minimumIntegerDigits: 2 })}:00`
      }`}</span>
      <input
        type="checkbox"
        className="absolute inset-0 appearance-none"
        {...rest}
      />
    </div>
  )
}
