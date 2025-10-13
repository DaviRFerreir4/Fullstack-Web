import { sum } from './server'

describe('sum', () => {
  let sumResult: number

  beforeAll(() => {
    sumResult = 10
    console.log('Executado antes dos testes', sumResult)
  })

  afterAll(() => {
    sumResult = 0
    console.log('Executado depois dos testes', sumResult)
  })

  // it = test. É mais utilizado por ser mais semântico
  it('should do sum of 3 + 7 must be 10', () => {
    const result = sum(3, 7)

    expect(result).toBe(sumResult)
    // expect(result).toBe(12) // retorna falha. Sempre testar o verdadeiro e o falso dos testes para evitar falsos verdadeiros
  })

  test('sum of 2 + 2 must be 4', () => {
    const result = sum(2, 2)

    expect(result).toBe(4)
  })
})
