import dayjs from "dayjs";

const form = document.querySelector("form");
const selectedDate = document.querySelector("input[type=date]")

// Data atual para formatar o input
const inputToday = dayjs(new Date()).format("YYYY-MM-DD")

// Carrega a data atual e define a data mínima como sendo a data atual
selectedDate.value = inputToday
selectedDate.min = inputToday

form.onsubmit = (event) => {
  // Previne o comportamento padrão do formulário
  event.preventDefault()
}