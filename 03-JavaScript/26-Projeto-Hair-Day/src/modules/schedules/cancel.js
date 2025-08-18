import { scheduleCancel } from "../../services/schedule-cancel.js"
import { schedulesDay } from "../schedules/load.js"

const periods = document.querySelectorAll(".period")

// Gera evento de click para cada lista
periods.forEach((period) => {
  // Captura o clique na lista
  period.addEventListener("click", async (event) => {
    // Verifica se o clique ocorreu no icone de cancelar
    if(event.target.classList.contains("cancel-icon")) {
      // Recupera a li pai do icone e o id referente a ela
      const item = event.target.closest("li")
      const { id } = item.dataset

      if (id) {
        // Confirma se o usuário deseja realmente cancelar o agendamento
        const isConfirm = confirm("Tem certeza que deseja cancelar esse agendamento?")

        if (isConfirm) {
          // Remove o agendamento da API e recarrega a UI
          await scheduleCancel({ id })
          schedulesDay()
        }
      }
    }
  })
})