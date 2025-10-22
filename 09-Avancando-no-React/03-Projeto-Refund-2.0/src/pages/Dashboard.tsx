import { useState } from 'react'

import searchIconSvg from '../assets/search.svg'
import { CATEGORIES } from '../utils/categories'
import { formatCurrency } from '../utils/formatCurrency'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { RefundItem } from '../components/RefundItem'

const REFUND_ITEM_EXAMPLE = {
  id: '123',
  name: 'Davi',
  category: 'Transporte',
  amount: formatCurrency(34.5),
  categoryImg: CATEGORIES.transport.icon,
}

export function Dashboard() {
  const [name, setName] = useState('')

  function fetchRefunds(e: React.FormEvent) {
    e.preventDefault()

    console.log(name)
  }

  return (
    <div className="bg-gray-500 rounded-xl p-10 md:min-w-[768px]">
      <h1 className="text-gray-100 font-bold text-xl flex-1">Solicitações</h1>

      <form
        className="flex items-center justify-between pb-6 border-b border-b-gray-400 gap-2  mt-6"
        onSubmit={fetchRefunds}
      >
        <Input
          placeholder="Pesquisar pelo nome"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />

        <Button variant="icon" type="submit">
          <img src={searchIconSvg} alt="Icone de lupa" className="w-6" />
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-4 max-h-[342px] overflow-y-scroll ml-[0.425rem]">
        <RefundItem data={REFUND_ITEM_EXAMPLE} />
        <RefundItem data={REFUND_ITEM_EXAMPLE} />
        <RefundItem data={REFUND_ITEM_EXAMPLE} />
      </div>
    </div>
  )
}
