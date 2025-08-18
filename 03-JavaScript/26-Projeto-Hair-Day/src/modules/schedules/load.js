import dayjs from "dayjs";
import { hoursLoad } from "../form/hours-load"
import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day.js"
import { scheduleShow } from "./show.js"

// Seleciona o input de data
const selectedDate = document.querySelector("input[type=date]");

// Data atual para formatar o input
const inputToday = dayjs(new Date()).format("YYYY-MM-DD")

// Carrega a data atual e define a data mínima como sendo a data atual
selectedDate.value = inputToday
selectedDate.min = inputToday

export async function schedulesDay() {
  // Obtem a data do input
  const date = selectedDate.value
  const dailySchedules = await scheduleFetchByDay({ date });
  
  // Exibe os agendamentos
  scheduleShow({ dailySchedules })

  // Renderiza as horas disponíveis
  hoursLoad({ date, dailySchedules })
}