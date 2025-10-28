import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { z, ZodError } from 'zod'
import { AxiosError } from 'axios'

import fileIconSvg from '../assets/file.svg'
import { CATEGORIES, CATEGORIES_KEYS } from '../utils/categories'

import { Input } from '../components/Input'
import { Select } from '../components/Select'
import { Upload } from '../components/Upload'
import { Button } from '../components/Button'

import { api } from '../services/api'

const refundSchema = z.object({
  name: z
    .string({ message: 'Nome é obrigatório' })
    .min(3, { message: 'Informe um nome claro para sua solicitação' }),
  category: z.enum(CATEGORIES_KEYS, {
    message: `Categoria deve conter os valores um dos seguintes valores: '${CATEGORIES_KEYS.join(
      "', '"
    )}'`,
  }),
  amount: z.coerce
    .number({ message: 'Informe um valor válido' })
    .gt(0, { message: 'Informe um valor maior do que 0' }),
})

export function Refund() {
  const navigate = useNavigate()
  const params = useParams<{ id: string }>()

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (params.id) {
      navigate(-1)
    }

    try {
      setIsLoading(true)

      if (!file) {
        return console.log({ message: 'Selecione um arquivo de comprovante' })
      }

      const fileUploadForm = new FormData()
      fileUploadForm.append('file', file)

      const response = await api.post('/uploads', fileUploadForm)

      const data = refundSchema.parse({
        name,
        category,
        amount: amount.replace(',', '.'),
      })

      await api.post('/refunds', {
        ...data,
        filename: response.data.filename,
      })

      navigate('/confirm', { state: { fromSubmit: true } })
    } catch (error) {
      if (error instanceof ZodError) {
        return console.log({ message: error.issues[0].message })
      }

      if (error instanceof AxiosError) {
        return console.log({ message: error.response?.data.message })
      }

      return console.log({
        message:
          'Não foi possível registrar sua requisição.\nPor favor, tente novamente mais tarde.',
      })
    } finally {
      setIsLoading(false)
    }
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

      {params.id ? (
        <a
          href="#"
          target="_blank"
          className="text-sm text-green-100 font-semibold flex items-center justify-center gap-2 my-6 hover:opacity-70 transition ease-linear"
        >
          <img src={fileIconSvg} alt="Icone de arquivo" />
          <span>Abrir comprovante</span>
        </a>
      ) : (
        <Upload
          required
          filename={file && file.name}
          onChange={(e) => {
            e.target.files && setFile(e.target.files[0])
          }}
        />
      )}

      <Button type="submit" isLoading={isLoading}>
        {params.id ? 'Voltar' : 'Enviar'}
      </Button>
    </form>
  )
}
