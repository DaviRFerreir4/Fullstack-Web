import tipIcon from '../../assets/tip.svg'
import styles from './styles.module.css'

type Props = {
  tipText: string
}

export function Tip({ tipText }: Props) {
  return (
    <div className={styles.tip}>
      <img src={tipIcon} alt="Icone de dica" />
      <div>
        <h3>Dica</h3>
        <p>{tipText}</p>
      </div>
    </div>
  )
}
