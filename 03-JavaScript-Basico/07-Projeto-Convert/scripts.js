// Cotação de moedas do dia.
const USD = 5.42;
const EUR = 6.31;
const GBP = 7.31;

// Capturando os elementos da página
const form = document.querySelector("form");
const amount = document.querySelector("input#amount");
const currency = document.querySelector("select#currency");
const footer = document.querySelector("main footer");
const description = document.querySelector("span#description");

// Manipulando o input amount para receber somente números
amount.addEventListener("input", () => {
  const hasCharRegex = /\D+/g;
  amount.value = amount.value.replace(hasCharRegex, "");
});

// Capturando o evento de submit do formulário
form.onsubmit = (event) => {
  event.preventDefault();
  switch(currency.value) {
    case "USD":
      convertCurrency(amount.value, USD, "US$");
      break;
    case "EUR":
      convertCurrency(amount.value, EUR, "€");
      break;
    case "GBP":
      convertCurrency(amount.value, GBP, "£");
      break;
    default:
      alert("Por favor selecione uma moeda válida");
  }
};

// Função para converter a moeda
function convertCurrency(amount, price, symbol) {
  try {
    description.textContent = `${symbol} 1 = ${price}`;
    footer.classList.add("show-result");
  } catch (error) {
    console.log(error);
    alert("Não foi possível converter, tente mais tarde.");
    footer.classList.remove("show-result");
  }
}