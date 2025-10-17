import styles from './styles.module.css'
import { Letter } from '../Letter'

// type Props = {}

export function LettersUsed() {
  return (
    <div className={styles['letters-used']}>
      <h5>Letras utilizadas</h5>
      <div>
        <Letter value="E" size="small" color="correct" />
        <Letter value="X" size="small" color="wrong" />
      </div>
    </div>
  )
}
