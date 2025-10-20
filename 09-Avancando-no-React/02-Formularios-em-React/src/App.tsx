import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import './App.css'

type FormData = {
  name: string
  date: string
  subject: string
  description: string
}

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  date: yup.string().required('Data é obrigatório'),
  subject: yup.string().required('Selecione um assunto'),
  description: yup
    .string()
    .required('Descrição é obrigatória')
    .min(10, 'Descrição deve conter no mínimo 10 digitos'),
})

export default function App() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      date: '',
      subject: '',
      description: '',
    },
    resolver: yupResolver(schema),
  })

  function submit(data: FormData) {
    console.log(data)
  }

  return (
    <div>
      <h1>Evento</h1>

      <form onSubmit={handleSubmit(submit)}>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <input type="text" placeholder="Nome do evento" {...field} />
          )}
        />

        <span className="error">Nome é obrigatório</span>

        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <input type="date" placeholder="Nome do evento" {...field} />
          )}
        />

        <Controller
          control={control}
          name="subject"
          render={({ field }) => (
            <select {...field}>
              <option value="" disabled>
                Selecione...
              </option>
              <option value="react">React</option>
              <option value="node">Node.js</option>
              <option value="javascript">Javascript</option>
              <option value="typescript">Typescript</option>
            </select>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <textarea placeholder="Descrição" rows={4} {...field} />
          )}
        />

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
