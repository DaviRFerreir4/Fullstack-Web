import styles from './style.module.css'
import logo from '../../assets/logo.png'
import resetIcon from '../../assets/restart.svg'

export function Header() {
  return (
    <header className={styles.container}>
      <img src={logo} alt="Logo da aplicação" />

      <div>
        <span>
          <strong>5</strong> de 10 tentativas
        </span>

        <button type="button">
          <img src={resetIcon} alt="Icone de reiniciar" />
        </button>
      </div>
    </header>
  )
}
