import { useParams } from 'react-router'

export function Details() {
  const { id } = useParams()

  return (
    <div>
      <h1>Detalhes</h1>
      <span>
        ID do produto: <strong>{id}</strong>
      </span>
    </div>
  )
}
