// selecionando os elementos do formulário
const amount = document.querySelector("input#amount");



// capturando evento de input para formatar o valor
amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");
  value = Number(value) / 100;
  amount.value = formatCurrencyBRL(value);
};

// formatando o valor para reais brasileiros
function formatCurrencyBRL(value) {
  value = Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return value;
}
