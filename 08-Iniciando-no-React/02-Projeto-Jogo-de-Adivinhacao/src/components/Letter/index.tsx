import styles from './styles.module.css'

type Prop = {
  value?: string
  size?: 'default' | 'small'
}

export function Letter({ value = '', size = 'default' }: Prop) {
  return (
    <div
      className={`${styles.letter} ${
        size === 'small' && styles['letter-small']
      }`}
    >
      <span>{value}</span>
    </div>
  )
}
