import styles from './app.module.css'
import { Header } from './components/Header'
import { Tip } from './components/Tip'

export function App() {
  function handleGameRestart() {
    alert('jogo reiniciado')
  }

  return (
    <div className={styles.container}>
      <main>
        <Header current={5} max={10} onRestart={handleGameRestart} />
        <Tip tipText="Biblioteca para criar interfaces Web com Javascript." />
      </main>
    </div>
  )
}
