import styles from './app.module.css'
import { Header } from './components/Header'

export function App() {
  function handleGameRestart() {
    alert('jogo reiniciado')
  }

  return (
    <div className={styles.container}>
      <main>
        <Header current={5} max={10} onRestart={handleGameRestart} />
      </main>
    </div>
  )
}
