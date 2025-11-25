import { api } from './api-config'

export async function removeSchedule(id) {
  try {
    api.delete(`/schedules/${id}`)

    alert('Registro removido com sucesso')

    return true
  } catch (error) {
    alert(error)

    return false
  }
}
