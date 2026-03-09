import { useEffect, useState } from 'react'
import { Input } from './Input'
import { useClickOutside } from '../../hooks/useClickOutside'

type Props = React.ComponentProps<'input'> & {
  label: string
  items: { title: string; value: string }[]
  selectedItem?: string
  setSelectedItem?: (value: string) => void
  updateItems: (value?: string) => Promise<void>
}

export function Autocomplete({
  label,
  items,
  selectedItem,
  setSelectedItem,
  updateItems,
  onChange,
  ...rest
}: Props) {
  // bom revisar
  const [internalSelectedItem, setInternalSelectedItem] = useState('')

  const [openAutocomplete, setOpenAutocomplete] = useState(false)

  const [error, setError] = useState('')

  const ref = useClickOutside(() => {
    setOpenAutocomplete(false)
    const value = selectedItem ?? internalSelectedItem
    if (value !== '' && !items.map((item) => item.title).includes(value)) {
      setError('Esse item não é uma opção')
    }
  }, openAutocomplete) as React.RefObject<HTMLInputElement>

  useEffect(() => {
    const search = setTimeout(() => {
      const value = selectedItem ?? internalSelectedItem

      updateItems(value)
    }, 400)

    return () => clearTimeout(search)
  }, [selectedItem, internalSelectedItem])

  return (
    <div ref={ref as React.Ref<HTMLDivElement>}>
      <Input
        label={label}
        value={selectedItem ?? internalSelectedItem}
        onChange={(event) => {
          if (setSelectedItem) {
            setSelectedItem(event.target.value)
          } else {
            setInternalSelectedItem(event.target.value)
          }
          if (onChange) {
            onChange(event)
          }
        }}
        onFocus={() => {
          setOpenAutocomplete(true)
          setError('')
        }}
        error={error !== '' && selectedItem !== ''}
        helperText={selectedItem !== '' ? error : undefined}
        {...rest}
      />
      <ul
        className={`bg-gray-500 border border-gray-400 rounded-b-sm absolute z-10 max-h-24 w-[calc(100%-56px)] overflow-auto
        ${openAutocomplete ? 'block' : 'hidden'}`}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className={`border-x-4 border-y-2 border-transparent
                ${item.title === 'Nenhum item encontrado' ? 'opacity-50 cursor-default' : 'hover:bg-gray-400 transition-colors'}`}
            onClick={() => {
              if (item.title === 'Nenhum item encontrado') return

              if (setSelectedItem) {
                setSelectedItem(item.title)
              } else {
                setInternalSelectedItem(item.title)
              }
              setOpenAutocomplete(false)
            }}
          >
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
