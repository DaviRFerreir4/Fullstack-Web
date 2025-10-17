import styles from './styles.module.css'

type Props = React.ComponentProps<'input'>

export function Input({ ...rest }: Props) {
  console.log('carregou o input')
  return <input {...rest} className={styles.input} />
}
