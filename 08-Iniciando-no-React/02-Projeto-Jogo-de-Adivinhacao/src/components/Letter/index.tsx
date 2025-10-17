import styles from './styles.module.css'

type Prop = {
  value?: string
}

export function Letter({ value = '' }: Prop) {
  return (
    <div className={styles.letter}>
      <span>{value}</span>
    </div>
  )
}
