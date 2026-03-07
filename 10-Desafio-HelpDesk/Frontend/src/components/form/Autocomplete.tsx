import { useEffect, useState } from 'react'
import { Input } from './Input'
import { useClickOutside } from '../../hooks/useClickOutside'

type Props = {
  items: string[]
  name?: string
  selectedItem?: string
  setSelectedItem?: (value: string) => void
}

export function Autocomplete({
  items,
  name,
  selectedItem,
  setSelectedItem,
}: Props) {
  // bom revisar
  const [internalSelectedItem, setInternalSelectedItem] = useState('')

  const ref = useClickOutside(() => {
    setOpenAutocomplete(false)
    if (!items.includes(selectedItem ?? internalSelectedItem)) {
      setError('Esse item não é uma opção')
    }
  })

  const [itemsShown, setItemsShown] = useState<string[]>()

  const [openAutocomplete, setOpenAutocomplete] = useState(false)

  const [error, setError] = useState('')

  useEffect(() => {
    const search = setTimeout(() => {
      setItemsShown(
        items
          .filter((item) =>
            item
              .toLowerCase()
              .includes(
                selectedItem?.toLowerCase() ??
                  internalSelectedItem.toLowerCase()
              )
          )
          .slice(0, 5)
      )
    }, 400)

    return () => clearTimeout(search)
  }, [selectedItem, internalSelectedItem, items])

  return (
    <div ref={ref as React.Ref<HTMLDivElement>}>
      <Input
        label="Serviço"
        value={selectedItem ?? internalSelectedItem}
        onChange={(event) => {
          if (setSelectedItem) {
            setSelectedItem(event.target.value)
          } else {
            setInternalSelectedItem(event.target.value)
          }
        }}
        onFocus={() => {
          setOpenAutocomplete(true)
          setError('')
        }}
        error={error !== ''}
        helperText={error}
        name={name}
        id={name}
      />
      <ul
        className={`bg-gray-500 border border-gray-400 rounded-b-sm absolute max-h-24 w-[calc(100%-56px)] overflow-auto
        ${openAutocomplete ? 'block' : 'hidden'}`}
      >
        {itemsShown &&
          itemsShown.map((item, index) => (
            <li
              key={index}
              className="border-x-4 border-y-2 border-transparent hover:bg-gray-400 transition-colors"
              onClick={() => {
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
