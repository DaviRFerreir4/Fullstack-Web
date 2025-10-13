import { sum } from './server'

test('sum of 3 + 7 must be 10', () => {
  const result = sum(3, 7)

  expect(result).toBe(10)
  // expect(result).toBe(12) // retorna falha. Sempre testar o verdadeiro e o falso dos testes para evitar falsos verdadeiros
})
