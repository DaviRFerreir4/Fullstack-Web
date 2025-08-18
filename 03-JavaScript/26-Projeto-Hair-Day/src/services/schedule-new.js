import { apiConfig } from "./api-config"

export async function scheduleNew({ id, name, when }){
  try {
    // Faz uma requisição para envio de dados para a API
    await fetch(`${apiConfig.baseURL}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({id, name, when}),
    })

    alert("Agendamento realizado com sucesso!")
  } catch(error) {
    alert("Não foi possível registar o agendamento. Tente novamente mais tarde.")
    console.log(error);
  }
}