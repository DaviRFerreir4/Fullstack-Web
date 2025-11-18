const addItemButton = document.querySelector('button')
const newItemInput = document.querySelector('input')
const closeWarning = document.querySelector('.close-warning')

// newItemInput.focus()

addItemButton.addEventListener('click', () => {
  if (newItemInput.value.trim() === '') {
    newItemInput.value = ''
    newItemInput.focus()
    return alert('Preencha o novo item antes de cria-lo')
  }

  const newItem = document.createElement('li')
  const itemCheckbox = document.createElement('input')
  const itemText = document.createElement('span')
  const itemRemoveIcon = document.createElement('img')

  newItem.classList.add('item-container')
  itemCheckbox.setAttribute('type', 'checkbox')
  itemText.textContent = newItemInput.value
  itemRemoveIcon.setAttribute('src', './assets/trash.svg')
  itemRemoveIcon.setAttribute('alt', 'Remover Item')
  itemRemoveIcon.onclick = () => {
    removeItem(newItem)
  }
  itemCheckbox.onchange = () => {
    itemChecked(itemCheckbox)
  }

  newItem.append(itemCheckbox, itemText, itemRemoveIcon)
  document.querySelector('ul').append(newItem)
  newItemInput.value = ''
})

function removeItem(item) {
  item.remove()
  closeWarning.parentElement.classList.remove('hide')
}

function itemChecked(checkbox) {
  checkbox.nextElementSibling.classList.toggle('checked')
}

document.querySelectorAll('.remove-item').forEach((element) => {
  element.onclick = () => {
    removeItem(element.parentElement)
  }
})

document.querySelectorAll('li > input').forEach((element) => {
  element.onchange = () => {
    itemChecked(element)
  }
})

closeWarning.addEventListener('click', () => {
  closeWarning.parentElement.classList.add('hide')
})
