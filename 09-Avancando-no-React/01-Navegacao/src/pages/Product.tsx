import { useSearchParams } from 'react-router'

export function Product() {
  const [searcParams] = useSearchParams()

  const category = searcParams.get('category')
  const price = searcParams.get('price')

  return (
    <div>
      <nav>
        <a href="/">Voltar</a>
      </nav>
      <h1>Produtos</h1>
      {category && (
        <p>
          Categoria: <strong>{category}</strong>
        </p>
      )}
      {price && (
        <p>
          Preço: <strong>{price}</strong>
        </p>
      )}
    </div>
  )
}
