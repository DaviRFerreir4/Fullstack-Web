import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { CATEGORIES, CATEGORIES_KEYS } from '../utils/categories'
import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Upload } from '../components/Upload'
import { Button } from '../components/Button'

export function Refund() {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  const [name, setName] = useState('Teste')
  const [category, setCategory] = useState('Transporte')
  const [amount, setAmount] = useState('34')
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (params.id) {
      navigate(-1)
    }

    setIsLoading(true)

    console.log({
      solicitation: {
        name,
        category,
        amount,
        file,
      },
    })

    navigate('/confirm', { state: { fromSubmit: true } })
  }

  return (
    <form
      className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-[512px]"
      onSubmit={onSubmit}
    >
      <header>
        <h1 className="text-xl font-bold text-gray-100">
          Solicitação de reembolso
        </h1>
        <p className="text-sm text-gray-200 mt-2 mb-4">
          Dados da despesa para solicitar reembolso.
        </p>
      </header>

      <Input
        required
        legend="Nome da solicitação"
        value={name}
        onChange={(e) => {
          setName(e.target.value)
        }}
        disabled={!!params.id}
      />

      <div className="flex gap-4">
        <Select
          required
          legend="Categoria"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
          }}
          disabled={!!params.id}
        >
          {CATEGORIES_KEYS.map((category) => {
            return (
              <option value={category} key={category}>
                {CATEGORIES[category].name}
              </option>
            )
          })}
        </Select>

        <Input
          required
          legend="Valor"
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
          }}
          disabled={!!params.id}
        />
      </div>

      <Upload
        // required
        filename={file && file.name}
        onChange={(e) => {
          e.target.files && setFile(e.target.files[0])
        }}
      />

      <Button type="submit" isLoading={isLoading}>
        {params.id ? 'Voltar' : 'Enviar'}
      </Button>
    </form>
  )
}
