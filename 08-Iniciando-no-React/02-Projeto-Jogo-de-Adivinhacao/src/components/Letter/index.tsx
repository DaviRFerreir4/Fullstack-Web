import styles from './styles.module.css'

type Prop = {
  value?: string
  size?: 'default' | 'small'
  color?: 'default' | 'correct' | 'wrong'
}

export function Letter({
  value = '',
  size = 'default',
  color = 'default',
}: Prop) {
  return (
    <div
      className={`${styles.letter}
      ${size === 'small' && styles['letter-small']}
      ${
        color !== 'default' &&
        (color === 'correct'
          ? styles['letter-correct']
          : styles['letter-wrong'])
      }
      `}
    >
      <span>{value}</span>
    </div>
  )
}
