// import { useEffect } from 'react'
import styles from './style.module.css'

type Props = React.ComponentProps<'button'> & {
  name: string
}

export function Button({ name, ...rest }: Props) {
  // useEffect(() => {
  //   console.log('useEffect do componente')
  // }, [])

  return (
    <button className={styles.container} {...rest}>
      <span>{name}</span>
    </button>
  )
}
