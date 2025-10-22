export function formatCurrency(amount: number) {
  return Intl.NumberFormat('pt-br', {
    style: 'currency',
    currency: 'BRL',
  })
    .format(amount)
    .replace('R$', '')
}
