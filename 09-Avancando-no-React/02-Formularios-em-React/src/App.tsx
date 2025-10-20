import { useState } from 'react'

import './App.css'

export default function App() {
  const [name, setName] = useState('Teste')

  function submit(e: React.FormEvent<HTMLElement>) {
    e.preventDefault()

    setName('')
  }

  return (
    <div>
      <h1>Evento {name}</h1>

      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Nome do evento"
          onChange={(e) => {
            setName(e.target.value)
          }}
          value={name}
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
