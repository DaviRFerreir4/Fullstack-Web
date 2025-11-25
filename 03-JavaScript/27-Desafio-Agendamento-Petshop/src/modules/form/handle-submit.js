import dayjs from 'dayjs'
import { createSchedule } from '../../services/create-schedule'
import { loadSchedules } from '../schedules/load-schedules'
import { loadHours } from './load-hours'

const scheduleDialog = document.querySelector('dialog')
const submitScheduleButton = document.querySelector('button#schedule')
const schedulesDateInput = document.querySelector('input#sched-date')

const tutorNameInput = document.querySelector('input#tutor-name')
const petNameInput = document.querySelector('input#pet-name')
const phoneInput = document.querySelector('input#phone')
const serviceDescriptionInput = document.querySelector('textarea#service-desc')
const scheduleDateInput = document.querySelector('input#date')
const scheduleHourInput = document.querySelector('select#hour')

submitScheduleButton.addEventListener('click', (event) => {
  event.preventDefault()

  if (tutorNameInput.value.trim() === '') {
    tutorNameInput.value = ''
    tutorNameInput.focus()
    return alert('Insira o nome do tutor antes de continuar')
  }

  if (petNameInput.value.trim() === '') {
    petNameInput.value = ''
    petNameInput.focus()
    return alert('Insira o nome do pet antes de continuar')
  }

  if (phoneInput.value.trim() === '') {
    phoneInput.value = ''
    phoneInput.focus()
    return alert('Insira o telefone do tutor antes de continuar')
  }

  if (serviceDescriptionInput.value.trim() === '') {
    serviceDescriptionInput.value = ''
    serviceDescriptionInput.focus()
    return alert('Insira a descrição do serviço antes de continuar')
  }

  if (dayjs(scheduleDateInput.value).isBefore(dayjs().format('DD/MM/YYYY'))) {
    scheduleDateInput.value = dayjs().format('YYYY-MM-DD')
    scheduleDateInput.focus()
    return alert('Insira uma data válida')
  }

  if (scheduleHourInput.value === '') {
    scheduleHourInput.value = ''
    scheduleHourInput.focus()
    return alert('Insira a hora da consulta antes de continuar')
  }

  const date = dayjs(scheduleDateInput.value).hour(
    Number(scheduleHourInput.value)
  )

  const scheduleFormData = {
    id: self.crypto.randomUUID(),
    tutor_name: tutorNameInput.value,
    pet_name: petNameInput.value,
    phone: phoneInput.value,
    service: serviceDescriptionInput.value,
    date,
  }

  createSchedule(scheduleFormData).then(() => {
    tutorNameInput.value = ''
    petNameInput.value = ''
    phoneInput.value = ''
    serviceDescriptionInput.value = ''
    scheduleDateInput.value = dayjs().format('YYYY-MM-DD')

    schedulesDateInput.value = scheduleFormData.date.format('YYYY-MM-DD')

    loadHours(schedulesDateInput.value)

    loadSchedules(schedulesDateInput.value)

    scheduleDialog.close()
  })
})
