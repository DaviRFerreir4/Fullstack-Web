import { Controller, useForm } from 'react-hook-form'

import './App.css'

type FormData = {
  name: string
}

export default function App() {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
    },
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

        <input type="date" placeholder="Nome do evento" lang="pt-BR" />

        <select defaultValue="">
          <option value="" disabled>
            Selecione...
          </option>

          <option value="react">React</option>
          <option value="node">Node.js</option>
          <option value="javascript">Javascript</option>
          <option value="typescript">Typescript</option>
        </select>

        <textarea placeholder="Descrição" rows={4} />

        <button type="submit">Salvar</button>
      </form>
    </div>
  )
}
