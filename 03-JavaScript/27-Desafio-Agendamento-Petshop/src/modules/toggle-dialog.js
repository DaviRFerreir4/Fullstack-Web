import dayjs from 'dayjs'

const createNewScheduleButton = document.querySelector('button#create-schedule')
const closeDialogButton = document.querySelector('span#close-dialog')
const scheduleDialog = document.querySelector('dialog')

const tutorNameInput = document.querySelector('input#tutor-name')
const petNameInput = document.querySelector('input#pet-name')
const phoneInput = document.querySelector('input#phone')
const serviceDescriptionInput = document.querySelector('textarea#service-desc')
const scheduleDateInput = document.querySelector('input#date')
const scheduleHourInput = document.querySelector('select#hour')

// open dialog
createNewScheduleButton.addEventListener('click', () => {
  scheduleDialog.showModal()
})

// close dialog
closeDialogButton.addEventListener('click', () => {
  if (
    tutorNameInput.value.trim() !== '' ||
    petNameInput.value.trim() !== '' ||
    phoneInput.value.trim() !== '' ||
    serviceDescriptionInput.value.trim() !== '' ||
    scheduleDateInput.value !== dayjs().format('YYYY-MM-DD') ||
    scheduleHourInput.value.trim() !== ''
  ) {
    const leaveWithoutSave = confirm(
      'Você tem certeza que deseja sair sem salvar a consulta que estava sendo preenchida?'
    )

    if (!leaveWithoutSave) {
      return
    }

    tutorNameInput.value = ''
    petNameInput.value = ''
    phoneInput.value = ''
    serviceDescriptionInput.value = ''
    scheduleDateInput.value = dayjs().format('YYYY-MM-DD')
    scheduleHourInput.value = ''
  }

  scheduleDialog.close()
})
