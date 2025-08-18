import dayjs from "dayjs"
import { apiConfig } from "./api-config"

export async function scheduleFetchByDay({ date }) {
  try {
    // Faz uma requisição dos dados da API
    const response = await fetch(`${apiConfig.baseURL}/schedules`)

    // Converte para JSON
    const data = await response.json()

    // Filtra os agendamentos pelo dia selecionado
    const dailySchedules = data.filter((schedule) => {
      return dayjs(date).isSame(schedule.when, "day")
    })
    
    return dailySchedules
  } catch(error) {
    alert("Não foi possível retornar as informações de agendamentos do dia selecioando.")
    console.log(error)
  }
}