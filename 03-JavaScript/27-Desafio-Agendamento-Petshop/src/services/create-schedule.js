import { api } from './api-config'

export async function createSchedule(scheduleFormData) {
  try {
    await api.post('/schedules', scheduleFormData)

    alert('Agendamento realizado com sucesso!')
  } catch (error) {
    alert(error)
  }
}
