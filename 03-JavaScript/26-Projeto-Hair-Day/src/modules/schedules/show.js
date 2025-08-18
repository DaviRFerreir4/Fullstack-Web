import dayjs from "dayjs"

// Seleciona as sessões manhã, tarde e noite
const periodMorning = document.querySelector("ul#period-morning")
const periodAfternoon = document.querySelector("ul#period-afternoon")
const periodNight = document.querySelector("ul#period-night")

export function scheduleShow({ dailySchedules }) {
  try {
    // Limpa as listas
    periodMorning.innerHTML = ""
    periodAfternoon.innerHTML = ""
    periodNight.innerHTML = ""

    // Renderiza os agendamentos por período
    dailySchedules.forEach((schedule) => {
      const item = document.createElement("li")
      const time = document.createElement("strong")
      const name = document.createElement("span")
      const cancelIcon = document.createElement("img")

      // Adiciona o id do agendamento
      item.setAttribute("data-id", schedule.id)
      time.textContent = dayjs(schedule.when).format("HH:mm")
      name.textContent = schedule.name
      cancelIcon.classList.add("cancel-icon")
      cancelIcon.setAttribute("src", "./src/assets/cancel.svg")
      cancelIcon.setAttribute("alt", "Cancelar")

      item.append(time, name, cancelIcon)

      const hour = dayjs(schedule.when).hour()

      if(hour <= 12) {
        periodMorning.append(item)
      } else if (hour > 12 && hour <= 18) {
        periodAfternoon.append(item)
      } else {
        periodNight.append(item)
      }
    });
  } catch(error) {
    // alert("Não foi possível exibir os agendamentos")
    console.log(error)
  }
}