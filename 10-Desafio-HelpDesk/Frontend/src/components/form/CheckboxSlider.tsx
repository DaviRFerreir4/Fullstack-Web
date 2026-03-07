type Props = React.ComponentProps<'input'> & {
  text?: string
}

export function CheckboxSlider({ text, ...rest }: Props) {
  return (
    <div className="flex gap-2">
      <label htmlFor="slider" className="text-gray-300">
        {text}
      </label>
      <div className="relative w-10 border border-gray-100 rounded-4xl text-sm bg-gray-200 hover:bg-gray-100">
        <input
          type="checkbox"
          id="slider"
          className="w-full h-full appearance-none peer"
          {...rest}
        />
        <div className="h-4 w-4 absolute rounded-full bottom-1/2 translate-y-1/2 left-1 bg-gray-300 peer-checked:left-[calc(100%-20px)] peer-checked:bg-gray-500 pointer-events-none transition-all" />
      </div>
    </div>
  )
}
