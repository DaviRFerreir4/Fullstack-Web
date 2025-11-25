import dayjs from 'dayjs'
import { loadSchedules } from '../schedules/load-schedules'
import { loadHours } from './load-hours'

const schedulesDateInput = document.querySelector('input#sched-date')
const newScheduleDateInput = document.querySelector('input#date')

const todayDateFormated = dayjs().format('YYYY-MM-DD')

schedulesDateInput.value = todayDateFormated
schedulesDateInput.min = todayDateFormated
newScheduleDateInput.value = todayDateFormated
newScheduleDateInput.min = todayDateFormated

schedulesDateInput.addEventListener('change', () => {
  loadSchedules(schedulesDateInput.value)
})

loadSchedules(schedulesDateInput.value)

newScheduleDateInput.addEventListener('change', () => {
  loadHours(newScheduleDateInput.value)
})

loadHours(newScheduleDateInput.value)
