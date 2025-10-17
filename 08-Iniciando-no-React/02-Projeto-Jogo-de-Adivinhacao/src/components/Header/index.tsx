import styles from './style.module.css'
import logo from '../../assets/logo.png'
import resetIcon from '../../assets/restart.svg'

type Props = {
  current: number
  max: number
  onRestart: () => void
}

export function Header({ current = 0, max = 10, onRestart }: Props) {
  return (
    <header className={styles.container}>
      <img src={logo} alt="Logo da aplicação" />
      <div>
        <span>
          <strong>{current}</strong> de {max} tentativas
        </span>
        <button type="button" onClick={onRestart}>
          <img src={resetIcon} alt="Icone de reiniciar" />
        </button>
      </div>
    </header>
  )
}
