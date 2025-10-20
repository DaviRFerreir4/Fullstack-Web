import { useNavigate } from 'react-router'

export function Home() {
  const navigate = useNavigate()

  function productOpen() {
    navigate('/products')
  }

  return (
    <div>
      <nav>
        <a href="/products">Produtos</a>
        <a href="/products?category=tvs&price=2000">Categoria</a>
        <button type="button" onClick={productOpen}>
          Ver produtos
        </button>
      </nav>
      <h1>Página Home</h1>
    </div>
  )
}
