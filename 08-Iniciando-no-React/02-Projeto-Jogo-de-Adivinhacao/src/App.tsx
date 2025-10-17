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
  const [letter, setLetter] = useState('')
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([])
  const [score, setScore] = useState(0)

  function startGame() {
    setLetter('')
    setLettersUsed([])
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

    const hits = challenge.word
      .toLocaleUpperCase()
      .split('')
      .filter((char) => {
        return char === letter.toLocaleUpperCase()
      })

    const result = hits.length > 0

    setScore((prevState) => prevState + hits.length)

    setLettersUsed((prevState) => [
      ...prevState,
      {
        value: letter,
        correct: result,
      },
    ])

    setLetter('')
  }

  function handleGameRestart() {
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
        <Header
          current={lettersUsed.length}
          max={10}
          onRestart={handleGameRestart}
        />
        <Tip tipText={challenge.tip} />
        <div className={styles.word}>
          {challenge.word.split('').map((letter, index) => {
            const letterUsed = lettersUsed.find(
              (used) =>
                used.value.toLocaleUpperCase() === letter.toLocaleUpperCase()
            )
            return (
              <Letter
                key={`letter-${index}`}
                value={letterUsed?.value}
                color={letterUsed?.correct ? 'correct' : 'default'}
              />
            )
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
