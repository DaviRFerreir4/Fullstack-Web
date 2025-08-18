import { hoursLoad } from "../form/hours-load"

// Seleciona o input de data
const selectedDate = document.querySelector("input[type=date]");

export function schedulesDay() {
  // Obtem a data do input
  const date = selectedDate.value

  // Renderiza as horas disponíveis
  hoursLoad({ date })
}