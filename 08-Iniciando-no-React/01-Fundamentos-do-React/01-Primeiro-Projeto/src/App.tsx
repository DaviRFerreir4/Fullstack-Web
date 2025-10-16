import { Button } from './components/Button'

export function App() {
  return (
    <>
      <Button
        name="Teste"
        onClick={() => {
          alert('teste')
        }}
      />
      <Button name="etseT" />
      <Button name="Clique aqui" />
    </>
  )
}
