import { sum } from './server'

describe('sum', () => {
  // it = test. É mais utilizado por ser mais semântico
  it('should do sum of 3 + 7 must be 10', () => {
    const result = sum(3, 7)

    expect(result).toBe(10)
    // expect(result).toBe(12) // retorna falha. Sempre testar o verdadeiro e o falso dos testes para evitar falsos verdadeiros
  })

  test('sum of 2 + 2 must be 4', () => {
    const result = sum(2, 2)

    expect(result).toBe(4)
  })
})
