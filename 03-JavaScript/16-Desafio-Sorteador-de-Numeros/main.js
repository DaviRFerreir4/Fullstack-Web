const quantityInput = document.querySelector('input[name="quantity"]')
const minNumberInput = document.querySelector('input[name="from"]')
const maxNumberInput = document.querySelector('input[name="to"]')
const noRepeatedNumbersCheckbox = document.querySelector('input#no-repeat')

const lotterySection = document.querySelector('section#lottery')
const resultSection = document.querySelector('section#result')
const resultDiv = document.querySelector('#result div:nth-child(2)')

const generateButton = document.querySelector('button.generate')
const raffleAgainButton = document.querySelector('button.raffle-again')

function generateNumbers() {
  if (!quantityInput.value || !minNumberInput.value || !maxNumberInput.value) {
    return alert('Preencha os campos antes de sortear números')
  }

  const numbers = Number(quantityInput.value)
  const minNumber = Number(minNumberInput.value)
  const maxNumber = Number(maxNumberInput.value)

  if (minNumber > maxNumber) {
    return alert(
      'O número mínimo do sorteio não pode ser maior que o número máximo'
    )
  }

  if (
    noRepeatedNumbersCheckbox.checked &&
    numbers > maxNumber + 1 - minNumber
  ) {
    return alert(
      'Os números dentro do limite estipulado são menores que a quantidade de números que não se repetem pedidos'
    )
  }

  resultDiv.replaceChildren()

  lotterySection.classList.toggle('hide')
  resultSection.classList.toggle('hide')

  if (noRepeatedNumbersCheckbox.checked) {
    return noRepeatRaffle(minNumber, maxNumber, numbers)
  }

  raffle(minNumber, maxNumber, numbers)
}

function raffle(min, max, numbers) {
  for (let i = 0; i < numbers; i++) {
    const numberSpan = document.createElement('span')
    numberSpan.textContent = Math.floor(Math.random() * (max - min + 1) + min)
    resultDiv.append(numberSpan)
  }
}

function noRepeatRaffle(min, max, numbers) {
  const possibleNumbers = []

  for (let i = min; i <= max; i++) {
    possibleNumbers.push(i)
  }

  for (let i = 0; i < numbers; i++) {
    const numberSpan = document.createElement('span')
    numberSpan.textContent = possibleNumbers.splice(
      Math.floor(Math.random() * (possibleNumbers.length - min)),
      1
    )
    resultDiv.append(numberSpan)
  }
}

function raffleAgain() {
  lotterySection.classList.toggle('hide')
  resultSection.classList.toggle('hide')
}

generateButton.addEventListener('click', generateNumbers)
raffleAgainButton.addEventListener('click', raffleAgain)
