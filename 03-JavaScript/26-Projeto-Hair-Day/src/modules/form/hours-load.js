import dayjs from "dayjs"
import { openingHours } from "../../utils/opening-hours.js"

// Captura a lista do formulário
const hours = document.querySelector("ul#hours")

export function hoursLoad({ date }) {
  const opening = openingHours.map((hour) => {
    // Recupera somente a hora
    const [scheduleHour] = hour.split(":")
    
    // Adiciona a hora na data e verifica se está no passado
    const isHourPast = dayjs(date).add(scheduleHour, "hour").isAfter(dayjs())
    
    // Retorna a disponibilidade de horários
    return {
      hour,
      avaiable: isHourPast
    }
  })

  // Renderizar os horários
  opening.forEach(({ hour, avaiable }) => {
    const li = document.createElement("li")
    li.classList.add(
      "hour",
      (avaiable ? "hour-available" : "hour-unavailable")
    )
    li.textContent = `${hour}`
    hours.append(li);
  })
}