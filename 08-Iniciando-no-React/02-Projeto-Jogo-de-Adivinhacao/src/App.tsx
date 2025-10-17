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

  const attemptMargin = 5

  const letterRegex = /^[a-zA-Z]+$/

  function startGame() {
    setLetter('')
    setLettersUsed([])
    setScore(0)
    const index = Math.floor(Math.random() * 5)
    setChallenge((prevState) => {
      if (!prevState) {
        return WORDS[index]
      }
      if (prevState.word === WORDS[index].word) {
        return WORDS[index === 0 ? index + 1 : index - 1]
      }
      return WORDS[index]
    })
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
      setLetter('')
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
    const isConfirmed = window.confirm('Você tem certeza que deseja reiniciar?')
    if (isConfirmed) {
      startGame()
    }
  }

  function gameEnd(message: string) {
    alert(message)
    startGame()
  }

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if (!challenge) {
      return
    }
    setTimeout(() => {
      if (score === challenge.word.length) {
        gameEnd('Parabéns, você descobriu a palavra! :D')
      }
      if (lettersUsed.length === challenge.word.length + attemptMargin) {
        gameEnd('Que pena, você usou todas suas tentativas :(')
      }
    }, 200)
  }, [score, lettersUsed.length])

  if (!challenge) {
    return
  }

  return (
    <div className={styles.container}>
      <main>
        <Header
          current={lettersUsed.length}
          max={challenge.word.length + attemptMargin}
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
              if (letterRegex.test(event.target.value)) {
                setLetter(event.target.value)
              } else {
                setLetter('')
              }
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
