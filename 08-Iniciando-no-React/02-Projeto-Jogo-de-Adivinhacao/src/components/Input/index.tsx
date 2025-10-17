import styles from './styles.module.css'

type Props = React.ComponentProps<'input'>

export function Input({ ...rest }: Props) {
  return <input {...rest} className={styles.input} />
}
