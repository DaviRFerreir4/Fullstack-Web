import styles from './styles.module.css'
import { Letter } from '../Letter'

// type Props = {}

export function LettersUsed() {
  return (
    <div className={styles['letters-used']}>
      <h5>Letras utilizadas</h5>
      <div>
        <Letter value="R" size="small" />
        <Letter value="E" size="small" />
      </div>
    </div>
  )
}
