import styles from './app.module.css'
import { Header } from './components/Header'
import { Tip } from './components/Tip'
import { Letter } from './components/Letter'

export function App() {
  function handleGameRestart() {
    alert('jogo reiniciado')
  }

  return (
    <div className={styles.container}>
      <main>
        <Header current={5} max={10} onRestart={handleGameRestart} />
        <Tip tipText="Biblioteca para criar interfaces Web com Javascript." />
        <div className={styles.word}>
          <Letter value="r" />
          <Letter value="e" />
          <Letter value="a" />
          <Letter value="c" />
          <Letter value="t" />
        </div>
      </main>
    </div>
  )
}
