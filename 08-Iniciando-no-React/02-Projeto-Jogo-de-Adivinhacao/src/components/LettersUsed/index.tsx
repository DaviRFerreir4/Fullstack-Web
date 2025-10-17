import styles from './styles.module.css'
import { Letter } from '../Letter'

export type LettersUsedProps = {
  value: string
  correct: boolean
}

type Props = {
  data: LettersUsedProps[]
}

export function LettersUsed({ data }: Props) {
  console.log('carregou o lettersUsed')
  return (
    <div className={styles['letters-used']}>
      <h5>Letras utilizadas</h5>
      <div>
        {data.map(({ value, correct }, index) => {
          return (
            <Letter
              value={value}
              size="small"
              color={correct ? 'correct' : 'wrong'}
              key={`used-letter-${index}`}
            />
          )
        })}
      </div>
    </div>
  )
}
