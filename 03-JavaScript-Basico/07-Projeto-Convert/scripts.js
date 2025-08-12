const amount = document.querySelector("input#amount");

// Manipulando o input amount para receber somente números
amount.addEventListener("input", () => {
  const hasCharRegex = /\D+/g;
  amount.value = amount.value.replace(hasCharRegex, "");
});