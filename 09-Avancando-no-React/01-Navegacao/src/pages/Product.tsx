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
      <div className="cards">
        <a href="/details/1">Produto 1</a>
        <a href="/details/2">Produto 2</a>
        <a href="/details/3">Produto 3</a>
        <a href="/details/4">Produto 4</a>
        <a href="/details/5">Produto 5</a>
      </div>
    </div>
  )
}
