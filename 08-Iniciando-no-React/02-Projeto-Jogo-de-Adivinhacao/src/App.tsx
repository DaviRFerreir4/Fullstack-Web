import styles from './app.module.css'
import { Header } from './components/Header'
import { Tip } from './components/Tip'
import { Letter } from './components/Letter'
import { Input } from './components/Input'
import { Button } from './components/Button'
import { LettersUsed } from './components/LettersUsed'

import { useEffect, useState } from 'react'

import { WORDS } from './utils/words'
import type { Challenge } from './utils/words'

export function App() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [letter, setLetter] = useState<string>('')
  const [attempts, setAttempts] = useState<number>(0)

  function startGame() {
    const index = Math.floor(Math.random() * 5)
    setChallenge(WORDS[index])
  }

  function handleGameRestart() {
    setAttempts(0)
    setLetter('')
    startGame()
    alert('jogo reiniciado')
  }

  useEffect(() => {
    startGame()
  }, [])

  if (!challenge) {
    return
  }

  return (
    <div className={styles.container}>
      <main>
        <Header current={5} max={10} onRestart={handleGameRestart} />
        <Tip tipText="Biblioteca para criar interfaces Web com Javascript." />
        <div className={styles.word}>
          {challenge.word.split('').map((_, index) => {
            return <Letter key={`letter-${index}`} />
          })}
        </div>
        <h4>Palpite</h4>
        <div>
          <Input autoFocus maxLength={1} placeholder="?" />
          <Button title="Confirmar" />
        </div>
        <LettersUsed />
      </main>
    </div>
  )
}
