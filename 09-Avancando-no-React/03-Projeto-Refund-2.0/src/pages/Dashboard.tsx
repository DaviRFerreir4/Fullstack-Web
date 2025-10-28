import { useEffect, useState } from 'react'
import { AxiosError } from 'axios'

import searchIconSvg from '../assets/search.svg'
import { CATEGORIES } from '../utils/categories'
import { formatCurrency } from '../utils/formatCurrency'

import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { RefundItem } from '../components/RefundItem'
import { Pagination } from '../components/Pagination'

import { api } from '../services/api'

const REFUND_ITEM_EXAMPLE = {
  id: '123',
  name: 'Davi',
  category: 'Transporte',
  amount: formatCurrency(34.5),
  categoryImg: CATEGORIES.transport.icon,
}

const PER_PAGE = 5

export function Dashboard() {
  const [name, setName] = useState('')
  const [page, setPage] = useState(1)
  const [totalOfPages, setTotalOfPages] = useState(0)
  const [refunds, setRefunds] = useState([REFUND_ITEM_EXAMPLE])

  async function fetchRefunds(e?: React.FormEvent) {
    if (e) {
      e.preventDefault()
    }

    try {
      const response = await api.get<RefundPaginationData>(
        `/refunds?name=${name.trim()}&page=${page}&perPage=${PER_PAGE}`
      )

      console.log(response.data)
    } catch (error) {
      if (error instanceof AxiosError) {
        return alert(error.response?.data.message)
      }

      return alert(
        'Não foi possível carregar os registros de reembolsos.\nPor favor, tente novamente mais tarde.'
      )
    }
  }

  function handlePagination(action: 'next' | 'previous') {
    setPage((prevPage) => {
      if (action === 'next' && prevPage < totalOfPages) {
        return prevPage + 1
      }
      if (action === 'previous' && prevPage > 1) {
        return prevPage - 1
      }
      return prevPage
    })
  }

  useEffect(() => {
    fetchRefunds()
  }, [])

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

      <div className="my-6 flex flex-col gap-4 max-h-[342px] overflow-y-scroll ml-[0.425rem]">
        {refunds.map((refundData) => {
          return (
            <RefundItem
              data={refundData}
              href={`/refund/${refundData.id}`}
              key={refundData.id}
            />
          )
        })}
      </div>

      <Pagination
        current={page}
        total={totalOfPages}
        onNext={() => {
          handlePagination('next')
        }}
        onPrevious={() => {
          handlePagination('previous')
        }}
      />
    </div>
  )
}
