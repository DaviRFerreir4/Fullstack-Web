import dayjs from "dayjs"
import { scheduleNew } from "../../services/schedule-new.js"
import { schedulesDay } from "../schedules/load.js"

const form = document.querySelector("form")
const clientName = document.querySelector("input#client")
const selectedDate = document.querySelector("input[type=date]")

form.onsubmit = async (event) => {
  // Previne o comportamento padrão do formulário
  event.preventDefault()

  try {
    // Recupera o valor e testa se ele é vazio
    const name = clientName.value.trim()
    if(!name) {
      return alert("Informe o nome do cliente!")
    }

    // Recupera o horário selecionado e testa se ele é vazio
    const hourSelected = document.querySelector(".hour-selected")
    if(!hourSelected) {
      return alert("Selecione a hora!")
    }

    // Recupera somente a hora
    const [ hour ] = hourSelected.innerText.split(":")

    // Insere a hora na data
    const date = selectedDate.value
    const when = dayjs(date).add(hour, "hour");

    // Gera um ID
    const id = new Date().getTime()

    // Faz o agendamento
    await scheduleNew({
      id,
      name,
      when
    })

    // Recarrega a UI
    await schedulesDay()

    // Reseta os campos para criação de um novo agendamento
    clientName.value = ""
  } catch(error) {
    alert("Não foi possível realizar o agendamento.")
    console.log(error)
  }
}