const form = document.querySelector("form");
const selectedDate = document.querySelector("input[type=date]")

form.onsubmit = (event) => {
  // Previne o comportamento padrão do formulário
  event.preventDefault()
}