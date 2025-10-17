import tipIcon from '../../assets/tip.svg'
import styles from './styles.module.css'

type Props = {
  tipText: string
}

export function Tip({ tipText }: Props) {
  return (
    <div className={styles.container}>
      <img src={tipIcon} alt="Icone de dica" />
      <div>
        <span>Dica</span>
        <span>{tipText}</span>
      </div>
    </div>
  )
}
