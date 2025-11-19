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
  generateButton.disabled = true
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

  resultSection.classList.toggle('opacity-0')
  resultSection.classList.toggle('hide')
  lotterySection.classList.toggle('opacity-0')

  setTimeout(() => {
    lotterySection.classList.toggle('hide')
    generateButton.disabled = false
  }, 1000)

  let animationDelay = 1000

  if (noRepeatedNumbersCheckbox.checked) {
    return noRepeatRaffle(minNumber, maxNumber, numbers, animationDelay)
  }

  raffle(minNumber, maxNumber, numbers, animationDelay)
}

function raffle(min, max, numbers, animationDelay) {
  for (let i = 0; i < numbers; i++) {
    const numberContainer = document.createElement('div')
    const numberSpan = document.createElement('span')
    numberContainer.style.animationDelay = `${animationDelay}ms`
    animationDelay += 4000
    numberSpan.textContent = Math.floor(Math.random() * (max - min + 1) + min)
    numberContainer.append(numberSpan)
    resultDiv.append(numberContainer)
  }

  raffleAgainButton.disabled = true
  setTimeout(() => {
    raffleAgainButton.disabled = false
  }, animationDelay + 500)
}

function noRepeatRaffle(min, max, numbers, animationDelay) {
  const possibleNumbers = []

  for (let i = min; i <= max; i++) {
    possibleNumbers.push(i)
  }

  for (let i = 0; i < numbers; i++) {
    const numberContainer = document.createElement('div')
    const numberSpan = document.createElement('span')
    numberContainer.style.animationDelay = `${animationDelay}ms`
    animationDelay += 4000
    numberSpan.textContent = possibleNumbers.splice(
      Math.floor(Math.random() * (possibleNumbers.length - min)),
      1
    )
    numberContainer.append(numberSpan)
    resultDiv.append(numberContainer)
  }

  raffleAgainButton.disabled = true
  setTimeout(() => {
    raffleAgainButton.disabled = false
  }, animationDelay + 1000)
}

function raffleAgain() {
  raffleAgainButton.disabled = true

  resultSection.classList.toggle('opacity-0')
  lotterySection.classList.toggle('hide')
  lotterySection.classList.toggle('opacity-0')

  setTimeout(() => {
    resultSection.classList.toggle('hide')
    raffleAgainButton.disabled = true
  }, 1000)
}

generateButton.addEventListener('click', generateNumbers)
raffleAgainButton.addEventListener('click', raffleAgain)
