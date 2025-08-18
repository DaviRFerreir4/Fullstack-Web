import { apiConfig } from "./api-config.js"

export async function scheduleCancel({ id }) {
  try {
    console.log(await fetch(`${apiConfig.baseURL}/schedules/${id}`, {
      method: "DELETE",
    }))

    // alert("Agendamento cancelado com sucesso!")
  } catch(error) {
    alert("Não foi possível cancelar o agendamento. Tente novamente mais tarde.")
    console.log(error)
  }
}