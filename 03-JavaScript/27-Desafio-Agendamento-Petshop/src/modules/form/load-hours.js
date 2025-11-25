import dayjs from 'dayjs'
import { schedulesFilteredByDay } from '../../services/schedules-filtered-by-day'
import { openingHours } from '../../utils/opening-hours'

const hourSelect = document.querySelector('select#hour')

export async function loadHours(dateFilter) {
  hourSelect.innerHTML = ''

  const defaultOption = document.createElement('option')
  defaultOption.value = ''
  defaultOption.innerText = 'Escolha:'
  defaultOption.selected = true
  defaultOption.disabled = true
  defaultOption.hidden = true

  hourSelect.append(defaultOption)

  const schedules = await schedulesFilteredByDay(dateFilter)

  const scheduledHours = schedules.map((schedule) => {
    return dayjs(schedule.date).format('HH:mm')
  })

  for (const hour of openingHours) {
    const hourFormated = hour.split(':')[0]

    const hourOption = document.createElement('option')
    hourOption.value = hourFormated
    hourOption.innerText = hour

    if (
      dayjs(dateFilter).format('DD/MM/YYYY') === dayjs().format('DD/MM/YYYY') &&
      dayjs().hour() >= Number(hourFormated)
    ) {
      hourOption.disabled = true
      hourOption.hidden = true
    }

    if (scheduledHours.includes(hour)) {
      hourOption.disabled = true
      hourOption.hidden = true
    }

    hourSelect.append(hourOption)
  }
}
