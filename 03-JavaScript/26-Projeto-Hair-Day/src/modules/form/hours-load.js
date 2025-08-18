import dayjs from "dayjs"
import { openingHours } from "../../utils/opening-hours.js"
import { hoursClick } from "./hours-click.js"

// Captura a lista do formulário
const hours = document.querySelector("ul#hours")

export function hoursLoad({ date, dailySchedules }) {
  hours.innerHTML = ""

  // Obtém a lista de horários ocupados
  const unavailableHours = dailySchedules.map((schedules) => {
    return dayjs(schedules.when).format("HH:mm")
  })
  
  const opening = openingHours.map((hour) => {
    // Recupera somente a hora
    const [scheduleHour] = hour.split(":")
    
    // Adiciona a hora na data e verifica se está no passado
    const isHourPast = dayjs(date).add(scheduleHour, "hour").isBefore(dayjs())
    
    const avaiable = !unavailableHours.includes(hour) && !isHourPast

    // Retorna a disponibilidade de horários
    return {
      hour,
      avaiable,
    }
  })

  // Renderizar os horários
  opening.forEach(({ hour, avaiable }) => {
    switch(hour) {
      case "9:00":
        hourHeaderAdd("Manhã")
        break;
      case "13:00":
        hourHeaderAdd("Tarde")
        break;
      case "19:00":
        hourHeaderAdd("Noite")
        break;
    }
    const li = document.createElement("li")
    li.classList.add(
      "hour",
      (avaiable ? "hour-available" : "hour-unavailable")
    )
    li.textContent = `${hour}`
    hours.append(li);
  })

  hoursClick()
}

function hourHeaderAdd(title) {
  const header = document.createElement("li")
  header.classList.add("hour-period")
  header.textContent = title

  hours.append(header)
}