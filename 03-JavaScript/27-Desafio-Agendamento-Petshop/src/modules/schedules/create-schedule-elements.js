import dayjs from 'dayjs'
import { removeSchedule } from '../../services/remove-schedule'

const morningSchedulesList = document.querySelector('div#morning ul')
const eveningSchedulesList = document.querySelector('div#evening ul')
const nightSchedulesList = document.querySelector('div#night ul')

export function createScheduleElements(schedules) {
  morningSchedulesList.innerHTML = ''
  eveningSchedulesList.innerHTML = ''
  nightSchedulesList.innerHTML = ''

  schedules.forEach((schedule) => {
    const scheduleDate = dayjs(schedule.date)

    const scheduleContainer = document.createElement('li')
    scheduleContainer.classList.add('flex', 'align-center')

    const scheduleHourHeading = document.createElement('h3')
    scheduleHourHeading.innerText = scheduleDate.format('HH:mm')

    const petContainer = document.createElement('div')
    petContainer.setAttribute('id', 'pet')
    const petNameStrong = document.createElement('strong')
    petNameStrong.innerText = schedule.pet_name
    const ownerNameSmall = document.createElement('small')
    ownerNameSmall.innerText = schedule.tutor_name
    petContainer.append(petNameStrong)
    petContainer.innerHTML += ' / '
    petContainer.append(ownerNameSmall)

    const serviceSpan = document.createElement('span')
    serviceSpan.setAttribute('id', 'service')
    serviceSpan.innerText = schedule.service

    const removeScheduleSpan = document.createElement('span')
    removeScheduleSpan.setAttribute('id', 'remove')
    removeScheduleSpan.innerText = 'Remover agendamento'
    removeScheduleSpan.addEventListener('click', () => {
      if (removeSchedule(schedule.id)) {
        scheduleContainer.remove()
      }
    })

    scheduleContainer.append(
      scheduleHourHeading,
      petContainer,
      serviceSpan,
      removeScheduleSpan
    )

    const scheduleHour = scheduleDate.hour()

    if (scheduleHour >= 9 && scheduleHour <= 12) {
      morningSchedulesList.append(scheduleContainer)
    } else if (scheduleHour >= 13 && scheduleHour <= 18) {
      eveningSchedulesList.append(scheduleContainer)
    } else if (scheduleHour >= 19 && scheduleHour <= 21) {
      nightSchedulesList.append(scheduleContainer)
    }
  })

  if (morningSchedulesList.innerHTML === '') {
    morningSchedulesList.innerHTML = 'Nenhuma agenda para este período ainda'
  }

  if (eveningSchedulesList.innerHTML === '') {
    eveningSchedulesList.innerHTML = 'Nenhuma agenda para este período ainda'
  }

  if (nightSchedulesList.innerHTML === '') {
    nightSchedulesList.innerHTML = 'Nenhuma agenda para este período ainda'
  }
}
