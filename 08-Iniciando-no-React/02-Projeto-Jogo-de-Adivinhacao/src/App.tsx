import styles from './app.module.css'
import { Header } from './components/Header'
import { Tip } from './components/Tip'
import { Letter } from './components/Letter'
import { Input } from './components/Input'
import { Button } from './components/Button'
import { LettersUsed, type LettersUsedProps } from './components/LettersUsed'

import { useEffect, useState } from 'react'

import { WORDS, type Challenge } from './utils/words'

export function App() {
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [letter, setLetter] = useState<string>('')
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([])
  const [attempts, setAttempts] = useState<number>(0)

  function startGame() {
    const index = Math.floor(Math.random() * 5)
    setChallenge(WORDS[index])
  }

  function handleConfirm() {
    if (!challenge) {
      return
    }

    if (!letter.trim()) {
      return alert('Digite uma letra')
    }

    if (
      lettersUsed.find(({ value: letterUsed }) => {
        return letterUsed.toLocaleUpperCase() === letter.toLocaleUpperCase()
      })
    ) {
      return alert('Digite uma letra que ainda não foi utilizada')
    }

    setLettersUsed((prevState) => [
      ...prevState,
      {
        value: letter,
        correct: Math.random() > 0.5 ? true : false,
      },
    ])

    setLetter('')
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
        <Header current={attempts} max={10} onRestart={handleGameRestart} />
        <Tip tipText="Biblioteca para criar interfaces Web com Javascript." />
        <div className={styles.word}>
          {challenge.word.split('').map((_, index) => {
            return <Letter key={`letter-${index}`} />
          })}
        </div>
        <h4>Palpite</h4>
        <div>
          <Input
            autoFocus
            maxLength={1}
            placeholder="?"
            onChange={(event) => {
              setLetter(event.target.value)
            }}
            value={letter}
          />
          <Button title="Confirmar" onClick={handleConfirm} />
        </div>
        <LettersUsed data={lettersUsed} />
      </main>
    </div>
  )
}
