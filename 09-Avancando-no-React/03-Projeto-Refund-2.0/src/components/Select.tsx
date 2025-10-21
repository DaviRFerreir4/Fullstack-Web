type Props = React.ComponentProps<'select'> & {
  legend?: string
}

export function Select({ legend, children, ...rest }: Props) {
  return (
    <fieldset className="flex flex-1 max-h-20 text-gray-200 focus-within:text-green-100">
      {legend && (
        <legend className="uppercase text-xxs mb-2 font-bold">{legend}</legend>
      )}
      <select
        className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm text-gray-100 bg-transparent placeholder-gray-300 outline-1 outline-transparent focus:outline-green-100 focus:border-green-100"
        {...rest}
      >
        <option value="" disabled hidden>
          Selecione...
        </option>
        {children}
      </select>
    </fieldset>
  )
}
