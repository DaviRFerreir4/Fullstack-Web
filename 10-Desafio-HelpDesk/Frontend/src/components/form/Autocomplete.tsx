import { useEffect, useState } from 'react'
import { Input } from './Input'
import { useClickOutside } from '../../hooks/useClickOutside'

type Props = React.ComponentProps<'input'> & {
  label: string
  items: string[]
  selectedItem?: string
  setSelectedItem?: (value: string) => void
}

export function Autocomplete({
  label,
  items,
  selectedItem,
  setSelectedItem,
  onChange,
  ...rest
}: Props) {
  // bom revisar
  const [internalSelectedItem, setInternalSelectedItem] = useState('')

  const [itemsShown, setItemsShown] = useState<string[]>()

  const [openAutocomplete, setOpenAutocomplete] = useState(false)

  const [error, setError] = useState('')

  const ref = useClickOutside(() => {
    setOpenAutocomplete(false)
    if (
      selectedItem !== '' &&
      !items.includes(selectedItem ?? internalSelectedItem)
    ) {
      setError('Esse item não é uma opção')
    }
  }, openAutocomplete) as React.RefObject<HTMLInputElement>

  useEffect(() => {
    const search = setTimeout(() => {
      const itemsToShow = items
        .filter((item) =>
          item
            .toLowerCase()
            .includes(
              selectedItem?.toLowerCase() ?? internalSelectedItem.toLowerCase()
            )
        )
        .slice(0, 5)

      if (itemsToShow.length === 0) {
        itemsToShow.push('Nenhum item encontrado')
      }

      setItemsShown(itemsToShow)
    }, 400)

    return () => clearTimeout(search)
  }, [selectedItem, internalSelectedItem, items])

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
        helperText={error}
        {...rest}
      />
      <ul
        className={`bg-gray-500 border border-gray-400 rounded-b-sm absolute z-10 max-h-24 w-[calc(100%-56px)] overflow-auto
        ${openAutocomplete ? 'block' : 'hidden'}`}
      >
        {itemsShown &&
          itemsShown.map((item, index) => (
            <li
              key={index}
              className={`border-x-4 border-y-2 border-transparent
                ${item === 'Nenhum item encontrado' ? 'opacity-50 cursor-default' : 'hover:bg-gray-400 transition-colors'}`}
              onClick={() => {
                if (item === 'Nenhum item encontrado') return

                if (setSelectedItem) {
                  setSelectedItem(item)
                } else {
                  setInternalSelectedItem(item)
                }
                setOpenAutocomplete(false)
              }}
            >
              {item}
            </li>
          ))}
      </ul>
    </div>
  )
}
