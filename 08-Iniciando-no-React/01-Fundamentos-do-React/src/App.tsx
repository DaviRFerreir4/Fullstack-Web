import './global.css'
import { useState, useEffect } from 'react'
import { Button } from './components/Button'
import styles from './app.module.css'
// import { useMessage } from './hooks/useMessage'

export function App() {
  // const { show } = useMessage({ name: 'Davi', age: 22 })

  const [count, setCount] = useState(0)
  // let count = 0

  function handleAdd() {
    setCount(count + 1)
    // count += 1
    // console.log(count)
  }

  function handleRemove() {
    if (count > 0) {
      setCount(count - 1)
    }
    // count -= 1
    // console.log(count)
  }

  useEffect(() => {
    if (count > 0) {
      console.log('o valor mudou para', count)
    }
  }, [count])

  return (
    <div className={styles.container}>
      <Button
        name="Adicionar"
        onClick={handleAdd}
        // onClick={() => {
        //   show('mensagem personalizada')
        // }}
      />
      <span>{count}</span>
      <Button name="Remover" onClick={handleRemove} />
    </div>
  )
}
